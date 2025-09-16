import { prisma } from "@/lib/prisma";

export async function POST(req) {
  const body = await req.json();
  const { from, to, date } = body;

  const buses = await prisma.bus.findMany();
  const fromCity = await prisma.city.findUnique({ where: { name: from } });
  const toCity = await prisma.city.findUnique({ where: { name: to } });

  if (!fromCity || !toCity) {
    return new Response(JSON.stringify({ error: "Kota tidak ditemukan" }), {
      status: 404,
    });
  }

  const schedules = buses
    .filter((bus) => {
      const route = bus.routes; // langsung array dari DB
      return route.includes(from) && route.includes(to);
    })
    .map((bus) => {
      const route = bus.routes;
      const fromIndex = route.indexOf(from);
      const toIndex = route.indexOf(to);
      const direction = fromIndex < toIndex ? "forward" : "backward";
      const depTime = bus.departureTimes[direction][0]; // langsung pakai
      const distance = Math.abs(fromCity.distance - toCity.distance);
      const averageSpeed = 50;
      const travelTime = Math.round((distance / averageSpeed) * 60);
      const arrivalMinutes =
        parseInt(depTime.split(":")[0]) * 60 +
        parseInt(depTime.split(":")[1]) +
        travelTime;
      const arrival = `${Math.floor(arrivalMinutes / 60)
        .toString()
        .padStart(2, "0")}:${(arrivalMinutes % 60)
        .toString()
        .padStart(2, "0")}`;
      const price = bus.basePrice * distance;
      const availableSeats = Math.floor(Math.random() * 21) + 10;

      return {
        id: `${bus.id}-${direction}-${from}-${to}`,
        bus,
        departure: depTime,
        arrival,
        travelTime,
        price,
        distance,
        direction,
        availableSeats,
        fromCityId: fromCity.id,
        toCityId: toCity.id,
      };
    });

  return new Response(JSON.stringify(schedules), { status: 200 });
}
