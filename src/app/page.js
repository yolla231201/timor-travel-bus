"use client";

import { useState, useEffect } from "react";
import {
  Bus,
  MapPin,
  Users,
  Wifi,
  Coffee,
  Shield,
  Star,
  Phone,
  Mail,
  Map,
  Clock,
  Calendar,
} from "lucide-react";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const [activeTab, setActiveTab] = useState("bus");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "check" }),
        });

        if (res.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (err) {
        console.error("Error checking login:", err);
        setIsLoggedIn(false);
      }
    };

    checkLogin();
  }, []);

  const toggleDropdown = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });

      if (!res.ok) throw new Error("Logout gagal");

      setIsLoggedIn(false);
      router.push("/login");
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat logout!");
    }
  };

  const handlePesanSekarang = async () => {
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "check" }),
      });

      if (!res.ok) {
        // Belum login, redirect ke halaman login
        router.push("/login");
        return;
      }

      // Sudah login, langsung ke halaman booking
      router.push("/booking");
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat memeriksa login!");
    }
  };

  return (
    <div className="">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
        <div className="container mx-auto px-10 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-4xl font-bold mb-4">
              Perjalanan Nyaman dengan Timor Trave
            </h2>
            <p className="text-xl mb-6">
              Melayani perjalanan antar kota dengan armada terbaik dan pelayanan
              prima.
            </p>
            <Link href="/jadwal">
              <button className="bg-white text-red-600 px-6 py-3 rounded-md font-bold hover:bg-gray-100">
                Lihat Jadwal & Pesan
              </button>
            </Link>
          </div>
          <div className="md:w-1/2">
            <img
              src="/bus2.png"
              alt="Bus Timor Trave yang modern dan nyaman dengan latar belakang pemandangan indah"
            />
          </div>
        </div>
      </section>

      {/* Bus Section */}
      <section id="bus" className="py-16 bg-white px-5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-red-600">
            Armada Kami
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Bus Eksekutif */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <img
                src="/bus1.png"
                alt="Bus eksekutif Timor Trave dengan interior mewah dan kursi berbahan kulit"
                className="w-full h-48 object-cover"
              />
              <div className="p-6 text-gray-700">
                <h3 className="text-xl font-bold mb-2">Bus Eksekutif</h3>
                <p className="text-gray-600 mb-4">
                  Kenyamanan premium dengan fasilitas lengkap untuk perjalanan
                  jarak jauh.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Users className="h-5 w-5 text-red-600 mr-2" />
                    <span>36-40 Kursi</span>
                  </li>
                  <li className="flex items-center">
                    <Wifi className="h-5 w-5 text-red-600 mr-2" />
                    <span>WiFi Gratis</span>
                  </li>
                  <li className="flex items-center">
                    <Coffee className="h-5 w-5 text-red-600 mr-2" />
                    <span>Snack & Minuman</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bus Bisnis */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <img
                src="bus2.png"
                alt="Bus bisnis Timor Trave dengan tata cahaya modern dan kenyamanan optimal"
                className="w-full h-48 object-cover"
              />
              <div className="p-6 text-gray-700">
                <h3 className="text-xl font-bold mb-2 ">Bus Bisnis</h3>
                <p className="text-gray-600 mb-4">
                  Pilihan tepat dengan harga terjangkau dan kenyamanan terjamin.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Users className="h-5 w-5 text-red-600 mr-2" />
                    <span>45-48 Kursi</span>
                  </li>
                  <li className="flex items-center">
                    <Coffee className="h-5 w-5 text-red-600 mr-2" />
                    <span>Air Mineral</span>
                  </li>
                  <li className="flex items-center">
                    <Shield className="h-5 w-5 text-red-600 mr-2" />
                    <span>Asuransi Perjalanan</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bus Economy */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <img
                src="/bus3.png"
                alt="Bus ekonomi Timor Trave yang bersih dan terawat dengan warna merah khas"
                className="w-full h-48 object-cover"
              />
              <div className="p-6 text-gray-700">
                <h3 className="text-xl font-bold mb-2">Bus Economy</h3>
                <p className="text-gray-600 mb-4">
                  Solusi perjalanan hemat dengan kualitas pelayanan terbaik.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <Users className="h-5 w-5 text-red-600 mr-2" />
                    <span>50-54 Kursi</span>
                  </li>
                  <li className="flex items-center">
                    <Shield className="h-5 w-5 text-red-600 mr-2" />
                    <span>Safety Terjamin</span>
                  </li>
                  <li className="flex items-center">
                    <Clock className="h-5 w-5 text-red-600 mr-2" />
                    <span>Keberangkatan Tepat Waktu</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rute Section */}
      <section id="rute" className="py-16 bg-gray-100 px-5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-red-600">
            Rute Perjalanan
          </h2>

          <div className="bg-white rounded-lg shadow-md p-6 mb-8 text-gray-600">
            <div className="flex items-center mb-6">
              <Map className="h-8 w-8 text-red-600 mr-3" />
              <h3 className="text-2xl font-bold">Rute Utama</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold mb-3">Kupang - Dili</h4>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <MapPin className="h-5 w-5 text-red-600 mr-2" />
                    <span>Kupang → Atambua → Batugade → Dili</span>
                  </li>
                  <li className="flex items-center">
                    <Clock className="h-5 w-5 text-red-600 mr-2" />
                    <span>Durasi: 10-12 jam</span>
                  </li>
                  <li className="flex items-center">
                    <Calendar className="h-5 w-5 text-red-600 mr-2" />
                    <span>Setiap Hari: 08.00, 14.00, 20.00</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-3">Kupang - Ende</h4>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <MapPin className="h-5 w-5 text-red-600 mr-2" />
                    <span>Kupang → Soe → Kefa → Ende</span>
                  </li>
                  <li className="flex items-center">
                    <Clock className="h-5 w-5 text-red-600 mr-2" />
                    <span>Durasi: 8-10 jam</span>
                  </li>
                  <li className="flex items-center">
                    <Calendar className="h-5 w-5 text-red-600 mr-2" />
                    <span>Setiap Hari: 07.00, 13.00, 19.00</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-gray-600">
            <div className="flex items-center mb-6">
              <Map className="h-8 w-8 text-red-600 mr-3" />
              <h3 className="text-2xl font-bold ">Rute Lainnya</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border-l-4 border-red-600 pl-4 py-2">
                <h4 className="font-semibold">Kupang - Maumere</h4>
                <p className="text-gray-600">Via: Soe, Kefa, Bajawa</p>
              </div>
              <div className="border-l-4 border-red-600 pl-4 py-2">
                <h4 className="font-semibold">Kupang - Kalabahi</h4>
                <p className="text-gray-600">Via: Soe, Kefa</p>
              </div>
              <div className="border-l-4 border-red-600 pl-4 py-2">
                <h4 className="font-semibold">Kupang - Atambua</h4>
                <p className="text-gray-600">Via: Soe, Kefa</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fasilitas Section */}
      <section id="fasilitas" className="py-16 bg-white px-5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-red-600">
            Fasilitas Kami
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <div className="bg-red-100 p-3 rounded-full inline-flex mb-4">
                <Wifi className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="font-bold mb-2 text-gray-700">WiFi Gratis</h3>
              <p className="text-gray-600">
                Akses internet selama perjalanan untuk kenyamanan Anda
              </p>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <div className="bg-red-100 p-3 rounded-full inline-flex mb-4">
                <Coffee className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="font-bold mb-2 text-gray-700">Snack & Minuman</h3>
              <p className="text-gray-600">
                Snack dan minuman gratis untuk penumpang kelas eksekutif dan
                bisnis
              </p>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <div className="bg-red-100 p-3 rounded-full inline-flex mb-4">
                <Users className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="font-bold mb-2 text-gray-700">Kursi Nyaman</h3>
              <p className="text-gray-600">
                Kursi reclining dengan sandaran yang dapat diatur sesuai
                kenyamanan
              </p>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg text-center">
              <div className="bg-red-100 p-3 rounded-full inline-flex mb-4">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="font-bold mb-2 text-gray-700">Keamanan</h3>
              <p className="text-gray-600">
                Driver profesional dan armada terawat dengan standar keamanan
                tinggi
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 bg-gray-100 px-5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-red-600">
            Apa Kata Pelanggan Kami?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-800">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-gray-600 italic mb-4">
                "Perjalanan dengan Timor Trave sangat nyaman. Bus bersih, AC
                dingin, dan sopirnya handal."
              </p>
              <div className="flex items-center">
                <div className="bg-gray-300 rounded-full h-10 w-10 mr-3"></div>
                <div>
                  <p className="font-semibold">Maria da Silva</p>
                  <p className="text-gray-500">Pelanggan Setia</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-gray-600 italic mb-4">
                "Saya selalu memilih Timor Trave untuk perjalanan ke Dili.
                Pelayanannya prima dan tepat waktu."
              </p>
              <div className="flex items-center">
                <div className="bg-gray-300 rounded-full h-10 w-10 mr-3"></div>
                <div>
                  <p className="font-semibold">João dos Santos</p>
                  <p className="text-gray-500">Pelanggan Bisnis</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-gray-600 italic mb-4">
                "WiFi gratis dan snack selama perjalanan membuat perjalanan jauh
                tidak terasa membosankan."
              </p>
              <div className="flex items-center">
                <div className="bg-gray-300 rounded-full h-10 w-10 mr-3"></div>
                <div>
                  <p className="font-semibold">Ana Fernandes</p>
                  <p className="text-gray-500">Pelajar</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="pesan" className="py-16 bg-red-600 text-white px-5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Siap untuk Berpergian?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Pesan tiket bus Anda sekarang dan nikmati perjalanan nyaman dengan
            Timor Trave
          </p>
          <Link href="/booking">
            <button className="bg-white text-red-600 px-8 py-3 rounded-md font-bold text-lg hover:bg-gray-100">
              Pesan Tiket Sekarang
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
