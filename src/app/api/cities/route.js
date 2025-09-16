// app/api/cities/route.js
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cities = await prisma.city.findMany({
      select: { id: true, name: true }, // hanya ambil id & name
    });

    return new Response(JSON.stringify(cities), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching cities:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch cities" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
