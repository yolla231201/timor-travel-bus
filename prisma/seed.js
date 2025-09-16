import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // --- Cities ---
  const cities = [
    { name: "Kupang", distance: 0 },
    { name: "Atambua", distance: 200 },
    { name: "Malaka", distance: 250 },
    { name: "Soe", distance: 100 },
    { name: "Kefa", distance: 150 },
  ];

  for (const city of cities) {
    await prisma.city.upsert({
      where: { name: city.name },
      update: {},
      create: city,
    });
  }

  // --- Buses ---
  const buses = [
    {
      name: "Bus Merah",
      type: "Ekonomi",
      basePrice: 2000,
      facilities: ["AC", "Toilet", "TV"],
      routes: ["Kupang", "Soe", "Kefa", "Malaka"],
      departureTimes: { forward: ["08:00"], backward: ["15:00"] },
    },
    {
      name: "Bus Biru",
      type: "Bisnis",
      basePrice: 3500,
      facilities: ["AC", "Toilet", "TV", "Snack", "Wifi"],
      routes: ["Kupang", "Soe", "Kefa", "Malaka"],
      departureTimes: { forward: ["09:00"], backward: ["16:00"] },
    },
    {
      name: "Bus Hijau",
      type: "Eksekutif",
      basePrice: 5000,
      facilities: ["AC", "Toilet", "TV", "Snack", "Wifi", "Bantal"],
      routes: ["Kupang", "Soe", "Kefa", "Malaka"],
      departureTimes: { forward: ["07:30"], backward: ["14:30"] },
    },
    {
      name: "Bus Kuning",
      type: "Ekonomi",
      basePrice: 2000,
      facilities: ["AC", "Toilet"],
      routes: ["Atambua", "Kefa", "Soe", "Kupang"],
      departureTimes: { forward: ["08:30"], backward: ["15:30"] },
    },
    {
      name: "Bus Orange",
      type: "Bisnis",
      basePrice: 3500,
      facilities: ["AC", "Toilet", "Snack", "Wifi"],
      routes: ["Atambua", "Kefa", "Soe", "Kupang"],
      departureTimes: { forward: ["09:30"], backward: ["16:30"] },
    },
    {
      name: "Bus Hitam",
      type: "Eksekutif",
      basePrice: 5000,
      facilities: ["AC", "Toilet", "Snack", "Wifi", "Bantal"],
      routes: ["Atambua", "Kefa", "Soe", "Kupang"],
      departureTimes: { forward: ["07:00"], backward: ["14:00"] },
    },
  ];

  for (const bus of buses) {
    // --- Upsert bus ---
    const createdBus = await prisma.bus.upsert({
      where: { name: bus.name },
      update: {},
      create: {
        ...bus,
      },
    });

    // --- Create seats ---
    const existingSeats = await prisma.seat.count({
      where: { busId: createdBus.id },
    });
    if (existingSeats === 0) {
      const seats = [];
      for (let i = 1; i <= 30; i++) {
        seats.push({
          busId: createdBus.id,
          seatNumber: i.toString(),
          status: "available",
        });
      }
      await prisma.seat.createMany({ data: seats });
      console.log(`✅ 30 kursi untuk ${bus.name} dibuat`);
    }
  }

  // --- Dummy User ---
  const plainPassword = "password123";
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      name: "User Demo",
      email: "user@example.com",
      password: hashedPassword,
      phone: "081234567890",
    },
  });

  console.log("✅ Seeding selesai!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
