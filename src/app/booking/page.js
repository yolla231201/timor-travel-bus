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

  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [paymentToken, setPaymentToken] = useState(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [bookingId, setBookingId] = useState(null);

  const [cityNames, setCityNames] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Load user login
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

  // Load seats when schedule is selected
  useEffect(() => {
    async function loadSeats() {
      if (!selectedSchedule) return;
      const res = await fetch(
        `/api/seats?busId=${selectedSchedule.bus.id}&date=${date}`
      );
      const data = await res.json();
      data.sort((a, b) => Number(a.seatNumber) - Number(b.seatNumber));
      setSeats(data);
    }
    loadSeats();
  }, [selectedSchedule, date]);

  // Load Snap JS
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

  // Step 1: Cari Jadwal
  async function onSearch() {
    if (!from || !to || !date) return alert("Mohon isi semua kolom");
    if (from === to) return alert("Kota asal dan tujuan tidak boleh sama");

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
    setSelectedSeats([]);
  }

  function onChangeNumPassengers(n) {
    if (n < 1 || n > 5) return;
    setNumPassengers(n);
    const newPassengers = [...passengers];
    while (newPassengers.length < n)
      newPassengers.push({ name: "", birthDate: "", address: "" });
    while (newPassengers.length > n) newPassengers.pop();
    setPassengers(newPassengers);
    if (selectedSeats.length > n) setSelectedSeats(selectedSeats.slice(0, n));
  }

  function onPassengerChange(index, field, value) {
    const newPassengers = [...passengers];
    newPassengers[index][field] = value;
    setPassengers(newPassengers);
  }

  function toggleSeat(seatNumber) {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNumber));
    } else {
      if (selectedSeats.length >= numPassengers) {
        alert(`Jumlah kursi harus sesuai jumlah penumpang (${numPassengers})`);
        return;
      }
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  }

  // Step 3: Konfirmasi & buat booking
  async function onConfirmBooking() {
    if (selectedSeats.length !== numPassengers) {
      return alert(`Silakan pilih ${numPassengers} kursi`);
    }

    for (let i = 0; i < numPassengers; i++) {
      if (
        !passengers[i].name ||
        !passengers[i].birthDate ||
        !passengers[i].address
      ) {
        return alert(
          "Mohon isi nama, tanggal lahir, dan alamat semua penumpang"
        );
      }
    }

    if (!currentUser?.id) return alert("Silakan login terlebih dahulu!");

    try {
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
          seatNumbers: selectedSeats,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        return alert("Gagal membuat booking: " + err.error);
      }

      const data = await res.json();
      setBookingId(data.orderId);
      setPaymentToken(data.paymentToken);
      setStep(4); // masuk ke halaman bayar
      setShowModal(false);
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat membuat booking");
    }
  }

  function onPay() {
    if (!paymentToken) return alert("Payment token belum tersedia");

    window.snap.pay(paymentToken, {
      onSuccess: () => {
        alert("Pembayaran berhasil! Tiket sedang diproses.");
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
    setSeats([]);
    setSelectedSeats([]);
    setShowModal(false);
    setPaymentToken(null);
    setPaymentCompleted(false);
    setBookingId(null);
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 text-gray-900">
      <h1 className="text-4xl font-extrabold mb-8 text-center text-red-700">
        Pesan Tiket Bus
      </h1>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="bg-white shadow-lg rounded-2xl p-8 space-y-6">
          {/* Pilih kota & tanggal */}
          <div>
            <label className="block font-semibold mb-2 text-gray-700">
              <Bus className="inline mr-2 text-red-600" /> Kota Keberangkatan
            </label>
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-400"
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
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-400"
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
            </label>
            <input
              type="date"
              value={date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-400"
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

      {/* STEP 2 */}
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

      {/* STEP 3 */}
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

          {/* Jumlah Penumpang */}
          <div className="mb-4">
            <label className="block font-semibold mb-2 text-gray-700">
              Jumlah Penumpang
            </label>
            <input
              type="number"
              value={numPassengers}
              min={1}
              max={5}
              onChange={(e) => onChangeNumPassengers(Number(e.target.value))}
              className="w-20 border rounded-lg p-2 focus:ring-2 focus:ring-red-400"
            />
          </div>

          {/* Input Penumpang */}
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

          {/* Pilih Kursi */}
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">Pilih Kursi</h3>
            <div className="space-y-2">
              {Array.from({ length: Math.ceil(seats.length / 4) }).map(
                (_, rowIdx) => {
                  const rowSeats = seats.slice(rowIdx * 4, rowIdx * 4 + 4);
                  return (
                    <div key={rowIdx} className="flex justify-between">
                      <div className="flex gap-2">
                        {rowSeats.slice(0, 2).map((seat) => (
                          <button
                            key={seat.seatNumber}
                            onClick={() => toggleSeat(seat.seatNumber)}
                            className={`p-2 rounded ${
                              seat.status === "available"
                                ? selectedSeats.includes(seat.seatNumber)
                                  ? "bg-red-600 text-white"
                                  : "bg-gray-200"
                                : "bg-gray-400 cursor-not-allowed"
                            }`}
                            disabled={seat.status !== "available"}
                          >
                            {seat.seatNumber}
                          </button>
                        ))}
                      </div>
                      <div className="w-4"></div>
                      <div className="flex gap-2">
                        {rowSeats.slice(2, 4).map((seat) => (
                          <button
                            key={seat.seatNumber}
                            onClick={() => toggleSeat(seat.seatNumber)}
                            className={`p-2 rounded ${
                              seat.status === "available"
                                ? selectedSeats.includes(seat.seatNumber)
                                  ? "bg-red-600 text-white"
                                  : "bg-gray-200"
                                : "bg-gray-400 cursor-not-allowed"
                            }`}
                            disabled={seat.status !== "available"}
                          >
                            {seat.seatNumber}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="w-full bg-gradient-to-r from-red-700 to-red-500 text-white font-semibold py-3 rounded-xl hover:from-red-800 hover:to-red-600 transition-all"
          >
            Lanjut ke Konfirmasi
          </button>

          {/* Modal Konfirmasi */}
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
                <p>Kursi: {selectedSeats.join(", ")}</p>
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
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 4: Bayar */}
      {step === 4 && (
        <div className="bg-white shadow-lg rounded-2xl p-8 space-y-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Pembayaran</h2>
          <p>Booking ID: {bookingId}</p>
          <button
            onClick={onPay}
            className="mt-4 w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition-all"
          >
            Bayar Sekarang
          </button>
        </div>
      )}

      {/* STEP 5: Sukses */}
      {step === 5 && paymentCompleted && (
        <div className="bg-white shadow-lg rounded-2xl p-8 space-y-6 text-center">
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            Pembayaran Berhasil!
          </h2>
          <p>Terima kasih telah melakukan pemesanan.</p>
          <p>Booking ID: {bookingId}</p>
          <button
            onClick={reset}
            className="mt-4 w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition-all"
          >
            Pesan Tiket Lagi
          </button>
        </div>
      )}
    </div>
  );
}
