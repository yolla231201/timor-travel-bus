// utils/utils.js
import { prisma } from "@/lib/prisma";

const averageSpeed = 50; // km/h

function parseTimeToMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes) {
  const h = Math.floor(minutes / 60);
  const m = Math.floor(minutes % 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export async function generateSchedule(from, to, date) {
  if (from === to) return [];

  const fromCity = await prisma.city.findUnique({ where: { name: from } });
  const toCity = await prisma.city.findUnique({ where: { name: to } });
  if (!fromCity || !toCity) return [];

  const today = new Date();
  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  const buses = await prisma.bus.findMany();
  const schedules = [];

  for (const bus of buses) {
    const routes = bus.routes;
    const fromIndex = routes.indexOf(from);
    const toIndex = routes.indexOf(to);

    if (fromIndex === -1 || toIndex === -1) continue;

    let direction = null;
    if (fromIndex < toIndex) direction = "forward";
    else if (fromIndex > toIndex) direction = "backward";
    else continue;

    const depTimeStr = bus.departureTimes[direction][0];
    const distance = Math.abs(toCity.distance - fromCity.distance);
    const travelTime = (distance / averageSpeed) * 60;

    const depMinutes = parseTimeToMinutes(depTimeStr);
    const arrivalMinutes = depMinutes + travelTime;

    if (isToday) {
      const now = new Date();
      const nowMinutes = now.getHours() * 60 + now.getMinutes();
      if (depMinutes < nowMinutes) continue;
    }

    const price = bus.basePrice * distance;

    schedules.push({
      id: `${bus.id}-${direction}-${from}-${to}`,
      bus,
      departure: depTimeStr,
      arrival: minutesToTime(arrivalMinutes),
      travelTime: Math.round(travelTime),
      price,
      distance,
      direction,
      availableSeats: Math.floor(Math.random() * 21) + 10,
    });
  }

  return schedules;
}
