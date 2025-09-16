// app/api/auth/route.js
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { serialize } from "cookie";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  try {
    const body = await req.json();
    const { action } = body;

    // ================= Signup =================
    if (action === "signup") {
      const { fullName, email, password, phone } = body;

      // cek apakah user sudah ada
      const existingUser = await db.user.findUnique({ where: { email } });
      if (existingUser) {
        return NextResponse.json(
          { error: "Email sudah terdaftar!" },
          { status: 400 }
        );
      }

      // hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // buat user baru dengan UUID
      const newUser = await db.user.create({
        data: {
          id: uuidv4(),
          name: fullName,
          email,
          password: hashedPassword,
          phone: phone,
        },
      });

      return NextResponse.json({
        message: "User berhasil dibuat!",
        user: {
          id: newUser.id,
          fullName: newUser.name,
          email: newUser.email,
        },
      });
    }

    // ================= Login =================
    if (action === "login") {
      const { email, password } = body;

      // cek user
      const user = await db.user.findUnique({ where: { email } });
      if (!user) {
        return NextResponse.json(
          { error: "Email tidak ditemukan!" },
          { status: 400 }
        );
      }

      // cek password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return NextResponse.json({ error: "Password salah!" }, { status: 400 });
      }

      // buat cookie login
      const cookie = serialize("token", String(user.id), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24, // 1 hari
      });

      return NextResponse.json(
        {
          message: "Login berhasil",
          user: {
            id: user.id,
            fullName: user.name,
            email: user.email,
          },
        },
        { headers: { "Set-Cookie": cookie } }
      );
    }

    // ================= Logout =================
    if (action === "logout") {
      const cookie = serialize("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        expires: new Date(0),
      });

      return NextResponse.json(
        { message: "Logout berhasil" },
        { headers: { "Set-Cookie": cookie } }
      );
    }

    // ================= Check Login =================
    if (action === "check") {
      const token = req.cookies.get("token")?.value;
      if (!token)
        return NextResponse.json({ error: "Belum login" }, { status: 401 });

      const user = await db.user.findUnique({ where: { id: token } });
      if (!user)
        return NextResponse.json(
          { error: "User tidak ditemukan" },
          { status: 401 }
        );

      return NextResponse.json({
        id: user.id,
        fullName: user.name,
        email: user.email,
      });
    }

    // jika action tidak valid
    return NextResponse.json({ error: "Action tidak valid" }, { status: 400 });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
