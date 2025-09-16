"use client";

import { useState } from "react";
import {
  Bus,
  Calendar,
  Clock,
  MapPin,
  Search,
  Filter,
  ArrowUpDown,
} from "lucide-react";

import Link from "next/link";

export default function SchedulePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("time");
  const [filterRoute, setFilterRoute] = useState("all");
  const [filterBusType, setFilterBusType] = useState("all");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Data jadwal bus
  const scheduleData = [
    {
      id: 1,
      route: "Kupang - Dili",
      departure: "Kupang",
      destination: "Dili",
      departureTime: "08:00",
      arrivalTime: "18:00",
      duration: "10 jam",
      busType: "Eksekutif",
      price: 250000,
      availableSeats: 15,
      busNumber: "TT-001",
      status: "Tersedia",
    },
    {
      id: 2,
      route: "Kupang - Dili",
      departure: "Kupang",
      destination: "Dili",
      departureTime: "14:00",
      arrivalTime: "00:00",
      duration: "10 jam",
      busType: "Bisnis",
      price: 180000,
      availableSeats: 8,
      busNumber: "TT-002",
      status: "Tersedia",
    },
    {
      id: 3,
      route: "Kupang - Dili",
      departure: "Kupang",
      destination: "Dili",
      departureTime: "20:00",
      arrivalTime: "06:00",
      duration: "10 jam",
      busType: "Eksekutif",
      price: 250000,
      availableSeats: 22,
      busNumber: "TT-003",
      status: "Tersedia",
    },
    {
      id: 4,
      route: "Kupang - Ende",
      departure: "Kupang",
      destination: "Ende",
      departureTime: "07:00",
      arrivalTime: "15:00",
      duration: "8 jam",
      busType: "Eksekutif",
      price: 220000,
      availableSeats: 12,
      busNumber: "TT-004",
      status: "Tersedia",
    },
    {
      id: 5,
      route: "Kupang - Ende",
      departure: "Kupang",
      destination: "Ende",
      departureTime: "13:00",
      arrivalTime: "21:00",
      duration: "8 jam",
      busType: "Bisnis",
      price: 160000,
      availableSeats: 5,
      busNumber: "TT-005",
      status: "Hampir Penuh",
    },
    {
      id: 6,
      route: "Kupang - Ende",
      departure: "Kupang",
      destination: "Ende",
      departureTime: "19:00",
      arrivalTime: "03:00",
      duration: "8 jam",
      busType: "Economy",
      price: 120000,
      availableSeats: 25,
      busNumber: "TT-006",
      status: "Tersedia",
    },
    {
      id: 7,
      route: "Kupang - Maumere",
      departure: "Kupang",
      destination: "Maumere",
      departureTime: "06:30",
      arrivalTime: "13:30",
      duration: "7 jam",
      busType: "Bisnis",
      price: 150000,
      availableSeats: 18,
      busNumber: "TT-007",
      status: "Tersedia",
    },
    {
      id: 8,
      route: "Kupang - Maumere",
      departure: "Kupang",
      destination: "Maumere",
      departureTime: "12:00",
      arrivalTime: "19:00",
      duration: "7 jam",
      busType: "Economy",
      price: 110000,
      availableSeats: 30,
      busNumber: "TT-008",
      status: "Tersedia",
    },
    {
      id: 9,
      route: "Kupang - Atambua",
      departure: "Kupang",
      destination: "Atambua",
      departureTime: "09:00",
      arrivalTime: "12:00",
      duration: "3 jam",
      busType: "Eksekutif",
      price: 120000,
      availableSeats: 10,
      busNumber: "TT-009",
      status: "Tersedia",
    },
    {
      id: 10,
      route: "Kupang - Atambua",
      departure: "Kupang",
      destination: "Atambua",
      departureTime: "14:00",
      arrivalTime: "17:00",
      duration: "3 jam",
      busType: "Bisnis",
      price: 90000,
      availableSeats: 20,
      busNumber: "TT-010",
      status: "Tersedia",
    },
    {
      id: 11,
      route: "Kupang - Atambua",
      departure: "Kupang",
      destination: "Atambua",
      departureTime: "18:00",
      arrivalTime: "21:00",
      duration: "3 jam",
      busType: "Economy",
      price: 70000,
      availableSeats: 35,
      busNumber: "TT-011",
      status: "Tersedia",
    },
    {
      id: 12,
      route: "Dili - Kupang",
      departure: "Dili",
      destination: "Kupang",
      departureTime: "07:00",
      arrivalTime: "17:00",
      duration: "10 jam",
      busType: "Eksekutif",
      price: 250000,
      availableSeats: 18,
      busNumber: "TT-012",
      status: "Tersedia",
    },
  ];

  // Filter dan sort data
  const filteredSchedules = scheduleData
    .filter((schedule) => {
      const matchesSearch =
        schedule.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
        schedule.busNumber.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRoute =
        filterRoute === "all" || schedule.route === filterRoute;
      const matchesBusType =
        filterBusType === "all" || schedule.busType === filterBusType;

      return matchesSearch && matchesRoute && matchesBusType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "time":
          return a.departureTime.localeCompare(b.departureTime);
        case "price":
          return a.price - b.price;
        case "duration":
          return parseInt(a.duration) - parseInt(b.duration);
        default:
          return 0;
      }
    });

  const uniqueRoutes = [...new Set(scheduleData.map((item) => item.route))];
  const uniqueBusTypes = [...new Set(scheduleData.map((item) => item.busType))];

  const getStatusColor = (status) => {
    switch (status) {
      case "Tersedia":
        return "bg-green-100 text-green-800";
      case "Hampir Penuh":
        return "bg-yellow-100 text-yellow-800";
      case "Penuh":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getBusTypeColor = (busType) => {
    switch (busType) {
      case "Eksekutif":
        return "bg-purple-100 text-purple-800";
      case "Bisnis":
        return "bg-blue-100 text-blue-800";
      case "Economy":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-10 text-gray-600">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <div className="bg-red-600 text-white p-2 rounded-md mr-3">
            <Calendar className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-red-600">
            Jadwal Keberangkatan
          </h1>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Cari rute atau nomor bus..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Date Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            {/* Route Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rute
              </label>
              <select
                value={filterRoute}
                onChange={(e) => setFilterRoute(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">Semua Rute</option>
                {uniqueRoutes.map((route) => (
                  <option key={route} value={route}>
                    {route}
                  </option>
                ))}
              </select>
            </div>

            {/* Bus Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipe Bus
              </label>
              <select
                value={filterBusType}
                onChange={(e) => setFilterBusType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="all">Semua Tipe</option>
                {uniqueBusTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sort Options */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Urutkan:</span>
            <div className="flex space-x-2">
              <button
                onClick={() => setSortBy("time")}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  sortBy === "time"
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <Clock className="h-4 w-4 inline mr-1" />
                Waktu
              </button>
              <button
                onClick={() => setSortBy("price")}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  sortBy === "price"
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Harga
              </button>
              <button
                onClick={() => setSortBy("duration")}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  sortBy === "duration"
                    ? "bg-red-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Durasi
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Menampilkan {filteredSchedules.length} dari {scheduleData.length}{" "}
            jadwal
          </p>
        </div>

        {/* Schedule List */}
        <div className="space-y-4">
          {filteredSchedules.length > 0 ? (
            filteredSchedules.map((schedule) => (
              <div
                key={schedule.id}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  {/* Route and Time Info */}
                  <div className="flex-1 mb-4 lg:mb-0">
                    <div className="flex items-center mb-3">
                      <MapPin className="h-5 w-5 text-red-600 mr-2" />
                      <h3 className="text-lg font-bold text-gray-800">
                        {schedule.route}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Keberangkatan</p>
                        <p className="font-semibold">
                          {schedule.departureTime}
                        </p>
                        <p className="text-sm text-gray-600">
                          {schedule.departure}
                        </p>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-gray-600">Durasi</p>
                        <p className="font-semibold">{schedule.duration}</p>
                        <div className="flex items-center justify-center mt-1">
                          <div className="w-12 h-px bg-gray-300"></div>
                          <Bus className="h-4 w-4 mx-1 text-gray-400" />
                          <div className="w-12 h-px bg-gray-300"></div>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">Tiba</p>
                        <p className="font-semibold">{schedule.arrivalTime}</p>
                        <p className="text-sm text-gray-600">
                          {schedule.destination}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bus and Price Info */}
                  <div className="lg:text-right">
                    <div className="flex flex-wrap items-center gap-2 mb-3 lg:justify-end">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getBusTypeColor(
                          schedule.busType
                        )}`}
                      >
                        {schedule.busType}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          schedule.status
                        )}`}
                      >
                        {schedule.status}
                      </span>
                    </div>

                    <p className="text-2xl font-bold text-red-600 mb-2">
                      Rp {schedule.price.toLocaleString("id-ID")}
                    </p>

                    <p className="text-sm text-gray-600 mb-3">
                      No. Bus: {schedule.busNumber} • Kursi tersedia:{" "}
                      {schedule.availableSeats}
                    </p>

                    <Link
                      href="/booking"
                      className="bg-red-600 text-white px-6 py-2 rounded-md font-medium hover:bg-red-700 transition-colors"
                    >
                      Pesan Sekarang
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Tidak ada jadwal ditemukan
              </h3>
              <p className="text-gray-600">
                Coba ubah filter pencarian atau tanggal untuk melihat jadwal
                yang tersedia.
              </p>
            </div>
          )}
        </div>

        {/* Popular Routes */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Rute Populer</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <MapPin className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <h3 className="font-bold mb-1">Kupang - Dili</h3>
              <p className="text-gray-600 text-sm">10-12 jam</p>
              <p className="text-red-600 font-bold">Rp 120.000 - 250.000</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <MapPin className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <h3 className="font-bold mb-1">Kupang - Ende</h3>
              <p className="text-gray-600 text-sm">8-10 jam</p>
              <p className="text-red-600 font-bold">Rp 120.000 - 220.000</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4 text-center">
              <MapPin className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <h3 className="font-bold mb-1">Kupang - Atambua</h3>
              <p className="text-gray-600 text-sm">3-4 jam</p>
              <p className="text-red-600 font-bold">Rp 70.000 - 120.000</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
