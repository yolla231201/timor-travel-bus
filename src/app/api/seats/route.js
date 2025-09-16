import { prisma } from "@/lib/prisma";

// GET /api/seats?busId=1&date=2025-09-16
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const busId = Number(searchParams.get("busId"));
  const date = searchParams.get("date");

  if (!busId || !date)
    return new Response(JSON.stringify({ error: "Missing params" }), {
      status: 400,
    });

  // unlock expired seats 15 menit
  const expireDate = new Date(Date.now() - 15 * 60 * 1000);
  await prisma.seat.updateMany({
    where: { status: "locked", lockedAt: { lt: expireDate }, busId },
    data: { status: "available", lockedAt: null },
  });

  // get seats
  const seats = await prisma.seat.findMany({
    where: { busId },
    select: { seatNumber: true, status: true },
    orderBy: { seatNumber: "asc" },
  });

  return new Response(JSON.stringify(seats), { status: 200 });
}
