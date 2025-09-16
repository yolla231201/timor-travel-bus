"use client";

import { useState, useEffect } from "react";
import { Bus, Clock, Calendar, User } from "lucide-react";

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [numPassengers, setNumPassengers] = useState(1);
  const [passengers, setPassengers] = useState([
    { name: "", birthDate: "", address: "" },
  ]);
  const [seatNumbers, setSeatNumbers] = useState([]);
  const [paymentToken, setPaymentToken] = useState(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [cityNames, setCityNames] = useState([]);

  // Load user
  useEffect(() => {
    async function loadUser() {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "check" }),
      });
      const data = await res.json();
      if (!data.error) setCurrentUser(data);
    }
    loadUser();
  }, []);

  // Load cities
  useEffect(() => {
    async function loadCities() {
      const res = await fetch("/api/cities");
      const data = await res.json();
      setCityNames(data.map((c) => c.name));
    }
    loadCities();
  }, []);

  // Load Midtrans Snap
  useEffect(() => {
    const scriptId = "midtrans-snap-script";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
      script.setAttribute(
        "data-client-key",
        process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
      );
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Step 1: search schedules
  async function onSearch() {
    if (!from || !to || !date) return alert("Isi semua kolom");
    const res = await fetch("/api/schedules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from, to, date }),
    });
    const result = await res.json();
    setSchedules(result);
    setStep(2);
  }

  function onSelectSchedule(schedule) {
    setSelectedSchedule(schedule);
    setStep(3);
    setPassengers([{ name: "", birthDate: "", address: "" }]);
    setNumPassengers(1);
    setSeatNumbers([]);
  }

  function onChangeNumPassengers(n) {
    if (n < 1 || n > 5) return;
    setNumPassengers(n);
    const newPassengers = [...passengers];
    while (newPassengers.length < n)
      newPassengers.push({ name: "", birthDate: "", address: "" });
    while (newPassengers.length > n) newPassengers.pop();
    setPassengers(newPassengers);
  }

  function onPassengerChange(index, field, value) {
    const newPassengers = [...passengers];
    newPassengers[index][field] = value;
    setPassengers(newPassengers);
  }

  function toggleSeat(seat) {
    if (seatNumbers.includes(seat)) {
      setSeatNumbers(seatNumbers.filter((s) => s !== seat));
    } else {
      if (seatNumbers.length < numPassengers)
        setSeatNumbers([...seatNumbers, seat]);
    }
  }

  async function onConfirmBooking() {
    if (!currentUser?.id) return alert("Login dulu");
    if (seatNumbers.length !== numPassengers)
      return alert("Pilih kursi sesuai jumlah penumpang");

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: currentUser.id,
        busId: selectedSchedule.bus.id,
        fromCityId: selectedSchedule.fromCityId,
        toCityId: selectedSchedule.toCityId,
        date,
        passengers,
        seatNumbers,
      }),
    });

    const data = await res.json();
    if (data.error) return alert(data.error);

    setPaymentToken(data.paymentToken);
    setStep(4);
  }

  function onPay() {
    if (!paymentToken) return alert("Token belum tersedia");
    window.snap.pay(paymentToken, {
      onSuccess: async () => {
        alert("Pembayaran berhasil!");
        // Save booking
        const res = await fetch("/api/bookings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUser.id,
            busId: selectedSchedule.bus.id,
            fromCityId: selectedSchedule.fromCityId,
            toCityId: selectedSchedule.toCityId,
            date,
            passengers,
            seatNumbers,
          }),
        });
        const result = await res.json();
        setPaymentCompleted(true);
        setStep(5);
      },
      onPending: () => alert("Pembayaran pending"),
      onError: () => alert("Pembayaran gagal"),
      onClose: () => alert("Anda menutup popup pembayaran"),
    });
  }

  function reset() {
    setStep(1);
    setFrom("");
    setTo("");
    setDate("");
    setSchedules([]);
    setSelectedSchedule(null);
    setPassengers([{ name: "", birthDate: "", address: "" }]);
    setNumPassengers(1);
    setSeatNumbers([]);
    setPaymentToken(null);
    setPaymentCompleted(false);
  }

  // Render step
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-center text-red-700 mb-8">
        Pesan Tiket Bus
      </h1>
      {step === 1 && (
        <div className="bg-white p-8 rounded-2xl shadow space-y-4">
          <div>
            <label>Kota Keberangkatan</label>
            <select value={from} onChange={(e) => setFrom(e.target.value)}>
              <option value="">Pilih kota</option>
              {cityNames.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Kota Tujuan</label>
            <select value={to} onChange={(e) => setTo(e.target.value)}>
              <option value="">Pilih kota</option>
              {cityNames.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Tanggal</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <button
            onClick={onSearch}
            className="bg-red-600 text-white py-2 px-4 rounded"
          >
            Cari Jadwal
          </button>
        </div>
      )}
      {/* Step 2: Pilih Jadwal */}
      {step === 2 && (
        <div>
          <button
            onClick={() => setStep(1)}
            className="mb-4 text-red-600 underline"
          >
            &larr; Kembali
          </button>
          {schedules.length === 0 ? (
            <p className="text-center text-red-600 font-semibold text-lg">
              Tidak ada tiket tersedia.
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
                    <p className="mt-2 text-gray-700 flex items-center">
                      <Clock className="inline mr-1 text-red-600" /> Berangkat:{" "}
                      {sch.departure} - Tiba: {sch.arrival} ({sch.travelTime}{" "}
                      menit)
                    </p>
                    <p className="mt-1 text-gray-800 font-semibold">
                      Harga per orang: Rp {sch.price.toLocaleString()}
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

      {/* Step 3: Input Penumpang */}
      {step === 3 && selectedSchedule && (
        <div className="bg-white shadow-lg rounded-2xl p-8 space-y-6">
          <button
            onClick={() => setStep(2)}
            className="mb-4 text-red-600 underline"
          >
            &larr; Kembali
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
          {passengers.map((p, i) => (
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
                  <Calendar className="inline mr-1 text-red-600" /> Tanggal
                  Lahir
                </label>
                <input
                  type="date"
                  value={p.birthDate}
                  onChange={(e) =>
                    onPassengerChange(i, "birthDate", e.target.value)
                  }
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-400"
                />
              </div>

              <div>
                <label className="block mb-1 text-gray-600">
                  <Bus className="inline mr-1 text-red-600" /> Alamat
                </label>
                <input
                  type="text"
                  value={p.address}
                  onChange={(e) =>
                    onPassengerChange(i, "address", e.target.value)
                  }
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-400"
                />
              </div>
            </div>
          ))}
          <button
            onClick={() => setShowModal(true)}
            className="w-full bg-gradient-to-r from-red-700 to-red-500 text-white font-semibold py-3 rounded-xl hover:from-red-800 hover:to-red-600 transition-all"
          >
            Lanjut ke Konfirmasi
          </button>

          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative">
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                >
                  ✕
                </button>
                <h2 className="text-xl font-bold text-red-700 mb-4">
                  Konfirmasi Pesanan
                </h2>
                <p>Bus: {selectedSchedule.bus.name}</p>
                <p>
                  Rute: {from} → {to}
                </p>
                <p>Tanggal: {date}</p>
                <p>Jumlah Penumpang: {numPassengers}</p>
                <p>
                  Total Harga: Rp{" "}
                  {(selectedSchedule.price * numPassengers).toLocaleString()}
                </p>
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={() => setShowModal(false)}
                    className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Batal
                  </button>
                  <button
                    onClick={onConfirmBooking}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Konfirmasi & Lanjut Pembayaran
                    {paymentCompleted && (
                      <p>Pembayaran berhasil! Cek email untuk tiket.</p>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 4: Payment */}
      {step === 4 && (
        <div className="bg-white shadow-lg rounded-2xl p-8 space-y-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Metode Pembayaran
          </h2>
          <p className="text-gray-700">
            Klik bayar untuk membuka popup Midtrans
          </p>
          <button
            onClick={onPay}
            className="mt-4 bg-red-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-red-700"
          >
            Bayar Sekarang
          </button>
          <div className="mt-6 p-4 bg-gray-50 rounded-xl">
            <h3 className="font-semibold text-gray-700 mb-2">Rincian Tiket</h3>
            <p>Bus: {selectedSchedule.bus.name}</p>
            <p>
              Rute: {from} → {to}
            </p>
            <p>Tanggal: {date}</p>
            <p>Jumlah Penumpang: {numPassengers}</p>
            <p>
              Total Harga: Rp{" "}
              {(selectedSchedule.price * numPassengers).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {/* Step 5: Terima Kasih */}
      {step === 5 && paymentCompleted && (
        <div className="text-center space-y-6 bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-red-600">Terima Kasih!</h2>
          <p className="text-gray-700">Tiket Anda telah berhasil dipesan.</p>
          <p>
            Bus: {selectedSchedule.bus.name} | Rute: {from} → {to} | Tanggal:{" "}
            {date}
          </p>
          <p>Jumlah Penumpang: {numPassengers}</p>
          <p>
            Total Harga: Rp{" "}
            {(selectedSchedule.price * numPassengers).toLocaleString()}
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
