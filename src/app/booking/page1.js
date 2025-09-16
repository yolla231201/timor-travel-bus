"use client";

import { useState, useEffect } from "react";
import { Bus, Clock, Calendar, User, IdCard, X } from "lucide-react";

export default function Home() {
  const [step, setStep] = useState(1);

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");

  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const [passengers, setPassengers] = useState([{ name: "", ktp: "" }]);
  const [numPassengers, setNumPassengers] = useState(1);

  const [confirmed, setConfirmed] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [cityNames, setCityNames] = useState([]);

  // Fetch daftar kota
  useEffect(() => {
    async function loadCities() {
      const res = await fetch("/api/cities");
      const data = await res.json();
      setCityNames(data.map((c) => c.name));
    }
    loadCities();
  }, []);

  // Cari jadwal
  async function onSearch() {
    if (!from || !to || !date) {
      alert("Mohon isi semua kolom pencarian");
      return;
    }
    if (from === to) {
      alert("Kota asal dan tujuan tidak boleh sama");
      return;
    }

    const res = await fetch("/api/schedules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, date }),
    });
    const result = await res.json();
    setSchedules(result);
    setSelectedSchedule(null);
    setStep(2);
  }

  function onSelectSchedule(schedule) {
    setSelectedSchedule(schedule);
    setStep(3);
    setPassengers([{ name: "", ktp: "" }]);
    setNumPassengers(1);
  }

  function onChangeNumPassengers(n) {
    if (n < 1 || n > 5) return;
    setNumPassengers(n);
    const newPassengers = [...passengers];
    while (newPassengers.length < n) newPassengers.push({ name: "", ktp: "" });
    while (newPassengers.length > n) newPassengers.pop();
    setPassengers(newPassengers);
  }

  function onPassengerChange(index, field, value) {
    const newPassengers = [...passengers];
    newPassengers[index][field] = value;
    setPassengers(newPassengers);
  }

  function onConfirmPassengers() {
    for (let i = 0; i < numPassengers; i++) {
      if (!passengers[i].name || !passengers[i].ktp) {
        alert("Mohon isi nama dan KTP semua penumpang");
        return;
      }
    }
    setShowModal(true); // tampilkan modal konfirmasi
  }

  function onConfirmBooking() {
    // Simulasi create booking/tickets di server
    setConfirmed(true);
    setStep(5);
    setShowModal(false);
  }

  function reset() {
    setStep(1);
    setConfirmed(false);
    setFrom("");
    setTo("");
    setDate("");
    setSchedules([]);
    setSelectedSchedule(null);
    setPassengers([{ name: "", ktp: "" }]);
    setNumPassengers(1);
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 text-gray-900">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-red-700">
        Pesan Tiket Bus Lintas Timor
      </h1>

      {/* Step 1: Pencarian Jadwal */}
      {step === 1 && (
        <div className="bg-white shadow-lg rounded-2xl p-8 space-y-6">
          <div>
            <label className="block font-semibold mb-2 text-gray-700">
              <Bus className="inline mr-2 text-red-600" /> Kota Keberangkatan
            </label>
            <select
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-400"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            >
              <option value="">Pilih kota asal</option>
              {cityNames.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-2 text-gray-700">
              <Bus className="inline mr-2 text-red-600" /> Kota Tujuan
            </label>
            <select
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-400"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            >
              <option value="">Pilih kota tujuan</option>
              {cityNames.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-2 text-gray-700">
              <Calendar className="inline mr-2 text-red-600" /> Tanggal
              Keberangkatan
            </label>
            <input
              type="date"
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-400"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <button
            onClick={onSearch}
            className="w-full bg-gradient-to-r from-red-600 to-red-400 text-white font-semibold py-3 rounded-xl hover:from-red-700 hover:to-red-500 transition-all"
          >
            Cari Tiket
          </button>
        </div>
      )}

      {/* Step 2: Daftar Jadwal */}
      {step === 2 && (
        <div>
          <button
            onClick={() => setStep(1)}
            className="mb-4 text-red-600 underline hover:text-red-800"
          >
            &larr; Kembali ke pencarian
          </button>

          {schedules.length === 0 ? (
            <p className="text-center text-red-600 font-semibold text-lg">
              Tidak ada tiket tersedia untuk rute ini.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {schedules.map((sch) => (
                <div
                  key={sch.id}
                  className="border rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow bg-white flex flex-col justify-between"
                >
                  <div>
                    <h2 className="font-bold text-xl text-red-700">
                      {sch.bus.name}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Tipe: {sch.bus.type} | Fasilitas:{" "}
                      {sch.bus.facilities.join(", ")}
                    </p>
                    <p className="mt-2 text-gray-700 flex items-center">
                      <Clock className="inline mr-1 text-red-600" /> Berangkat:{" "}
                      {sch.departure} - Tiba: {sch.arrival} ({sch.travelTime}{" "}
                      menit)
                    </p>
                    <p className="mt-1 text-gray-800 font-semibold">
                      Harga per orang: Rp {sch.price.toLocaleString()}
                    </p>
                    <p className="text-gray-500 mt-1">
                      Kursi tersedia: {sch.availableSeats}
                    </p>
                  </div>
                  <button
                    onClick={() => onSelectSchedule(sch)}
                    className="mt-4 bg-gradient-to-r from-red-500 to-red-400 text-white font-semibold py-2 rounded-xl hover:from-red-600 hover:to-red-500 transition-all"
                  >
                    Pilih Jadwal
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 3: Input Data Penumpang */}
      {step === 3 && selectedSchedule && (
        <div className="bg-white shadow-lg rounded-2xl p-8 space-y-6">
          <button
            onClick={() => setStep(2)}
            className="mb-4 text-red-600 underline hover:text-red-800"
          >
            &larr; Kembali ke jadwal
          </button>

          <h2 className="font-bold text-2xl mb-4 text-gray-800">
            Input Data Penumpang ({numPassengers})
          </h2>

          <div className="mb-6">
            <label className="block font-semibold mb-2 text-gray-700">
              Jumlah Penumpang (1-5)
            </label>
            <input
              type="number"
              min={1}
              max={5}
              value={numPassengers}
              onChange={(e) => onChangeNumPassengers(Number(e.target.value))}
              className="border rounded-lg p-3 w-24 focus:ring-2 focus:ring-red-400"
            />
          </div>

          {passengers.slice(0, numPassengers).map((p, i) => (
            <div
              key={i}
              className="border p-6 rounded-xl mb-4 space-y-4 bg-gray-50 shadow-sm"
            >
              <h3 className="font-semibold text-lg text-gray-700">
                Penumpang {i + 1}
              </h3>
              <div>
                <label className="block mb-1 text-gray-600">
                  <User className="inline mr-1 text-red-600" /> Nama
                </label>
                <input
                  type="text"
                  value={p.name}
                  onChange={(e) => onPassengerChange(i, "name", e.target.value)}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-400"
                />
              </div>
              <div>
                <label className="block mb-1 text-gray-600">
                  <IdCard className="inline mr-1 text-red-600" /> No. KTP
                </label>
                <input
                  type="text"
                  value={p.ktp}
                  onChange={(e) => onPassengerChange(i, "ktp", e.target.value)}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-400"
                />
              </div>
            </div>
          ))}

          <button
            onClick={onConfirmPassengers}
            className="w-full bg-gradient-to-r from-red-700 to-red-500 text-white font-semibold py-3 rounded-xl hover:from-red-800 hover:to-red-600 transition-all"
          >
            Lanjut ke Konfirmasi
          </button>
        </div>
      )}

      {/* Modal Konfirmasi Detail Pemesanan */}
      {showModal && selectedSchedule && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
          <div className="bg-white rounded-2xl p-8 w-96 relative shadow-xl">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
            >
              <X />
            </button>
            <h2 className="text-2xl font-bold text-red-700 mb-4">
              Konfirmasi Pesanan
            </h2>
            <p className="text-gray-700 mb-1">
              Bus: <strong>{selectedSchedule.bus.name}</strong>
            </p>
            <p className="text-gray-700 mb-1">
              Dari: <strong>{from}</strong> → Ke: <strong>{to}</strong>
            </p>
            <p className="text-gray-700 mb-1">
              Tanggal: <strong>{date}</strong>
            </p>
            <p className="text-gray-700 mb-1">
              Jumlah Penumpang: <strong>{numPassengers}</strong>
            </p>
            <p className="text-gray-700 mb-4">
              Total Harga:{" "}
              <strong>
                Rp {(selectedSchedule.price * numPassengers).toLocaleString()}
              </strong>
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100"
              >
                Kembali
              </button>
              <button
                onClick={onConfirmBooking}
                className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Terima Kasih */}
      {step === 5 && confirmed && selectedSchedule && (
        <div className="text-center space-y-6 bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-red-600">
            Pembayaran Berhasil!
          </h2>
          <p className="text-gray-700">
            Tiket Anda untuk bus <strong>{selectedSchedule.bus.name}</strong>{" "}
            dari <strong>{from}</strong> ke <strong>{to}</strong> pada tanggal{" "}
            <strong>{date}</strong> telah dipesan.
          </p>
          <p className="text-gray-700">
            Jumlah penumpang: <strong>{numPassengers}</strong>
          </p>
          <p className="text-gray-700">
            Total harga:{" "}
            <strong>
              Rp {(selectedSchedule.price * numPassengers).toLocaleString()}
            </strong>
          </p>
          <button
            onClick={reset}
            className="mt-4 bg-gradient-to-r from-red-600 to-red-400 text-white font-semibold px-6 py-3 rounded-xl hover:from-red-700 hover:to-red-500 transition-all"
          >
            Pesan Tiket Lagi
          </button>
        </div>
      )}
    </div>
  );
}
