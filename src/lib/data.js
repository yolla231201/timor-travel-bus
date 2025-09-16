// data.js
export const cities = {
  Kupang: { lat: -10.1771, lng: 123.5833, distance: 0 },
  Atambua: { lat: -9.1067, lng: 124.89, distance: 200 },
  Malaka: { lat: -9.5, lng: 125.0, distance: 250 },
  Soe: { lat: -10.6, lng: 124.3, distance: 100 },
  Kefa: { lat: -9.8, lng: 124.7, distance: 150 },
};

export const buses = [
  {
    id: "bus1",
    name: "Bus Merah",
    type: "Ekonomi",
    facilities: ["AC", "Toilet", "TV"],
    basePrice: 2000,
    routes: ["Kupang", "Soe", "Kefa", "Malaka"],
    departureTimes: {
      forward: ["08:00"],
      backward: ["15:00"],
    },
  },
  {
    id: "bus2",
    name: "Bus Biru",
    type: "Bisnis",
    facilities: ["AC", "Toilet", "TV", "Snack", "Wifi"],
    basePrice: 3500,
    routes: ["Kupang", "Soe", "Kefa", "Malaka"],
    departureTimes: {
      forward: ["09:00"],
      backward: ["16:00"],
    },
  },
  {
    id: "bus3",
    name: "Bus Hijau",
    type: "Eksekutif",
    facilities: ["AC", "Toilet", "TV", "Snack", "Wifi", "Bantal"],
    basePrice: 5000,
    routes: ["Kupang", "Soe", "Kefa", "Malaka"],
    departureTimes: {
      forward: ["07:30"],
      backward: ["14:30"],
    },
  },
  {
    id: "bus4",
    name: "Bus Kuning",
    type: "Ekonomi",
    facilities: ["AC", "Toilet"],
    basePrice: 2000,
    routes: ["Atambua", "Kefa", "Soe", "Kupang"],
    departureTimes: {
      forward: ["08:30"],
      backward: ["15:30"],
    },
  },
  {
    id: "bus5",
    name: "Bus Orange",
    type: "Bisnis",
    facilities: ["AC", "Toilet", "Snack", "Wifi"],
    basePrice: 3500,
    routes: ["Atambua", "Kefa", "Soe", "Kupang"],
    departureTimes: {
      forward: ["09:30"],
      backward: ["16:30"],
    },
  },
  {
    id: "bus6",
    name: "Bus Hitam",
    type: "Eksekutif",
    facilities: ["AC", "Toilet", "Snack", "Wifi", "Bantal"],
    basePrice: 5000,
    routes: ["Atambua", "Kefa", "Soe", "Kupang"],
    departureTimes: {
      forward: ["07:00"],
      backward: ["14:00"],
    },
  },
];
