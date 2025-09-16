"use client";

import { useState, useEffect } from "react";
import { Bus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  // Toggle dropdown avatar
  const toggleDropdown = () => setIsMenuOpen(!isMenuOpen);

  // Cek status login saat Header pertama kali mount
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "check" }),
        });
        setIsLoggedIn(res.ok);
      } catch (err) {
        console.error("Error checking login:", err);
        setIsLoggedIn(false);
      }
    };
    checkLogin();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "logout" }),
      });
      if (res.ok) {
        setIsLoggedIn(false);
        router.push("/");
      } else throw new Error("Logout gagal");
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
        router.push("/login");
        return;
      }
      router.push("/booking");
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat memeriksa login!");
    }
  };

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50 px-4 md:px-10">
      <div className="container mx-auto py-4 flex items-center justify-between relative">
        {/* Logo kiri */}
        <div className="flex items-center">
          <div className="bg-red-600 text-white p-2 rounded-md mr-3">
            <Bus className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-red-600">Timor Trave</h1>
        </div>

        {/* Nav desktop */}
        <nav className="hidden lg:flex space-x-8 absolute left-1/2 transform -translate-x-1/2">
          <Link
            href="/#bus"
            className="block px-4 py-2 text-gray-700  hover:text-red-600 font-medium"
          >
            BUS KAMI
          </Link>
          <Link
            href="/#rute"
            className="block px-4 py-2 text-gray-700  hover:text-red-600 font-medium"
          >
            Rute
          </Link>
          <Link
            href="/#fasilitas"
            className="block px-4 py-2 text-gray-700  hover:text-red-600 font-medium"
          >
            Fasilitas
          </Link>
          <Link
            href="/#pesan"
            className="block px-4 py-2 text-gray-700  hover:text-red-600 font-medium"
          >
            Pesan Tiket
          </Link>
        </nav>

        {/* Tombol desktop */}
        <div className="hidden lg:flex items-center space-x-5">
          <button
            onClick={handlePesanSekarang}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 font-medium"
          >
            Pesan Sekarang
          </button>

          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={toggleDropdown}
                className="text-white bg-gray-700 hover:bg-gray-800 font-medium rounded-full text-sm p-3 w-10 h-10 flex items-center justify-center"
              >
                YK
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-4 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow-sm z-50">
                  <ul className="py-2 text-sm text-gray-700">
                    <li>
                      <Link
                        href="/dashboard"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Profil Saya
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/bookings"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Pesanan Saya
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/settings"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Pengaturan
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/help"
                        className="block px-4 py-2 hover:bg-gray-100"
                      >
                        Bantuan
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <button className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-800 font-medium">
                Login
              </button>
            </Link>
          )}
        </div>

        {/* Hamburger mobile */}
        <div className="lg:hidden flex items-center z-50">
          <button
            onClick={toggleDropdown}
            className="flex items-center -space-x-2 focus:outline-none"
          >
            {/* Container teks dengan animasi scroll */}
            <span className="relative h-6 w-16 overflow-hidden">
              <span
                className={`flex flex-col transition-transform duration-700 ease-in-out ${
                  isMenuOpen ? "-translate-y-[75%]" : "translate-y-0"
                }`}
              >
                <span
                  className={`${isMenuOpen ? "text-red-600" : "text-gray-700"}`}
                >
                  Open
                </span>
                <span
                  className={`${isMenuOpen ? "text-red-600" : "text-gray-700"}`}
                >
                  Close
                </span>
                <span
                  className={`${isMenuOpen ? "text-red-600" : "text-gray-700"}`}
                >
                  Open
                </span>
                <span
                  className={`${isMenuOpen ? "text-red-600" : "text-gray-700"}`}
                >
                  Close
                </span>
              </span>
            </span>

            {/* Icon berubah bentuk + warna sinkron */}
            <svg
              className={`w-6 h-6 transform transition-transform duration-700 ease-in-out ${
                isMenuOpen
                  ? "rotate-180 text-red-600"
                  : "rotate-0 text-gray-700"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={
                  isMenuOpen
                    ? "M6 18L18 6M6 6l12 12" // X
                    : "M12 4v16m8-8H4" // Plus
                }
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Layer hitam (paling bawah) */}
      <div
        className={`lg:hidden fixed top-0 right-0 w-3/4 md:w-1/2 h-screen bg-red-400 shadow-md transform transition-transform duration-700 ease-in-out
    ${isMenuOpen ? "translate-x-0 delay-0" : "translate-x-full"}
  `}
      />

      {/* Layer merah (tengah) */}
      <div
        className={`lg:hidden fixed top-0 right-0 w-3/4 md:w-1/2 h-screen bg-red-700 shadow-lg transform transition-transform duration-700 ease-in-out
    ${isMenuOpen ? "translate-x-0 delay-100" : "translate-x-full"}
  `}
      />

      {/* Layer putih (atas, content utama) */}
      <div
        className={`lg:hidden fixed top-0 right-0 w-3/4 md:w-1/2 h-screen bg-white shadow-xl pt-20 transform transition-transform duration-700 ease-in-out
    ${isMenuOpen ? "translate-x-0 delay-200" : "translate-x-full"}
  `}
      >
        <nav className="flex flex-col space-y-0 p-5">
          <Link
            href="/#bus"
            className="block pl-2 text-3xl md:text-4xl text-gray-800 hover:text-red-700 font-semibold"
          >
            BUS KAMI
          </Link>
          <Link
            href="/#rute"
            className="block pl-2 text-3xl md:text-4xl text-gray-800 hover:text-red-700 font-semibold"
          >
            RUTE
          </Link>
          <Link
            href="/#fasilitas"
            className="block pl-2 text-3xl md:text-4xl text-gray-800 hover:text-red-700 font-semibold"
          >
            FASILITAS
          </Link>
          <Link
            href="/#pesan"
            className="block pl-2 text-3xl md:text-4xl text-gray-800 hover:text-red-700 font-semibold"
          >
            PESAN TIKET
          </Link>

          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                className="block pl-2 text-3xl md:text-4xl text-gray-800 hover:text-red-700 font-semibold"
              >
                PROFIL SAYA
              </Link>
              <Link
                href="/bookings"
                className="block pl-2 text-3xl md:text-4xl text-gray-800 hover:text-red-700 font-semibold"
              >
                PESANAN SAYA
              </Link>
              <Link
                href="/settings"
                className="block pl-2 text-3xl md:text-4xl text-gray-800 hover:text-red-700 font-semibold"
              >
                PENGATURAN
              </Link>
              <Link
                href="/help"
                className="block pl-2 text-3xl md:text-4xl text-gray-800 hover:text-red-700 font-semibold"
              >
                BANTUAN
              </Link>
              <button
                onClick={handleLogout}
                className="w-1/3 p-2 rounded-md mx-2 mt-5 bg-red-600 text-white text-center hover:bg-red-700 hover:cursor-pointer"
              >
                LOGOUT
              </button>
            </>
          ) : (
            <Link href="/login">
              <button className="bg-gray-700 text-white pl-2 py-2 rounded-md hover:bg-gray-800 font-medium mt-2 w-full">
                Login
              </button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
