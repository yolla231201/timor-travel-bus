import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import midtransClient from "midtrans-client";

const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, busId, fromCityId, toCityId, date, seatNumbers } = body;

    // validasi cepat
    if (
      !userId ||
      !busId ||
      !fromCityId ||
      !toCityId ||
      !date ||
      !seatNumbers?.length
    ) {
      return new Response(
        JSON.stringify({ error: "Data booking tidak lengkap" }),
        { status: 400 }
      );
    }

    // --- Unlock expired locks (opsional safety) ---
    // kalau ada kursi yg "locked" lebih dari 15 menit, kembalikan jadi available
    const expireDate = new Date(Date.now() - 15 * 60 * 1000);
    await prisma.seat.updateMany({
      where: {
        status: "locked",
        lockedAt: { lt: expireDate },
        busId: Number(busId),
      },
      data: { status: "available", lockedAt: null, bookingId: null },
    });

    // Ambil kursi yang diminta dari DB (fresh data)
    const seats = await prisma.seat.findMany({
      where: {
        busId: Number(busId),
        seatNumber: { in: seatNumbers.map(String) },
      },
    });

    if (seats.length !== seatNumbers.length) {
      return new Response(
        JSON.stringify({ error: "Beberapa kursi tidak ditemukan" }),
        { status: 400 }
      );
    }

    // cek semuanya masih available
    const notAvailable = seats.filter((s) => s.status !== "available");
    if (notAvailable.length > 0) {
      return new Response(
        JSON.stringify({
          error: `Kursi sudah tidak tersedia: ${notAvailable
            .map((s) => s.seatNumber)
            .join(", ")}`,
        }),
        { status: 400 }
      );
    }

    // ambil bus & city untuk hitung harga
    const bus = await prisma.bus.findUnique({ where: { id: Number(busId) } });
    if (!bus)
      return new Response(JSON.stringify({ error: "Bus tidak ditemukan" }), {
        status: 404,
      });

    const fromCity = await prisma.city.findUnique({
      where: { id: Number(fromCityId) },
    });
    const toCity = await prisma.city.findUnique({
      where: { id: Number(toCityId) },
    });
    if (!fromCity || !toCity)
      return new Response(JSON.stringify({ error: "Kota tidak ditemukan" }), {
        status: 404,
      });

    const distance = Math.abs(fromCity.distance - toCity.distance);
    const totalPrice = bus.basePrice * distance * seatNumbers.length;

    // buat order id kita sendiri
    const orderId = `ORDER-${uuidv4()}`;

    // Buat booking dan lock kursi dalam satu transaction
    const bookingCreate = prisma.booking.create({
      data: {
        id: orderId,
        user: { connect: { id: userId } },
        bus: { connect: { id: Number(busId) } },
        fromCity: { connect: { id: Number(fromCityId) } },
        toCity: { connect: { id: Number(toCityId) } },
        date: new Date(date),
        numPassengers: seatNumbers.length,
        totalPrice,
        status: "pending",
      },
    });

    const seatIds = seats.map((s) => s.id);

    const seatLock = prisma.seat.updateMany({
      where: { id: { in: seatIds } },
      data: { status: "locked", lockedAt: new Date(), bookingId: orderId },
    });

    // jalankan transaction: buat booking + lock kursi
    await prisma.$transaction([bookingCreate, seatLock]);

    // generate midtrans token
    const transaction = await snap.createTransaction({
      transaction_details: { order_id: orderId, gross_amount: totalPrice },
      customer_details: { first_name: "Pelanggan" }, // bisa ganti
    });

    // logging helpful
    console.log(
      `Booking created (pending): ${orderId} seats locked: ${seatNumbers.join(
        ", "
      )}`
    );

    return new Response(
      JSON.stringify({ paymentToken: transaction.token, orderId, totalPrice }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Booking POST Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}
