// utils.js
import { buses, cities } from "./data";

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

export function generateSchedule(from, to, date) {
  if (from === to) return [];

  // Tidak ada rute langsung Atambua <-> Malaka
  if (
    (from === "Atambua" && to === "Malaka") ||
    (from === "Malaka" && to === "Atambua")
  )
    return [];

  const schedules = [];

  const today = new Date();
  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  for (const bus of buses) {
    const { routes, departureTimes, basePrice } = bus;

    const fromIndex = routes.indexOf(from);
    const toIndex = routes.indexOf(to);

    if (fromIndex === -1 || toIndex === -1) continue;

    let direction = null;
    if (fromIndex < toIndex) direction = "forward";
    else if (fromIndex > toIndex) direction = "backward";
    else continue;

    const depTimes = departureTimes[direction];
    if (!depTimes || depTimes.length === 0) continue;

    // Hanya 1 waktu berangkat per arah
    const depTimeStr = depTimes[0];

    const distFrom = cities[from].distance;
    const distTo = cities[to].distance;
    const distance = Math.abs(distTo - distFrom);

    const travelTime = (distance / averageSpeed) * 60;

    const depMinutes = parseTimeToMinutes(depTimeStr);
    const arrivalMinutes = depMinutes + travelTime;

    if (isToday) {
      const now = new Date();
      const nowMinutes = now.getHours() * 60 + now.getMinutes();
      if (depMinutes < nowMinutes) continue;
    }

    const price = basePrice * distance;

    const availableSeats = Math.floor(Math.random() * 21) + 10;

    schedules.push({
      id: `${bus.id}-${direction}-${from}-${to}`,
      bus,
      departure: depTimeStr,
      arrival: minutesToTime(arrivalMinutes),
      travelTime: Math.round(travelTime),
      price,
      distance,
      direction,
      availableSeats,
    });
  }

  return schedules;
}
