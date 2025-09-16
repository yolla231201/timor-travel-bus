"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // 👉 tambahin ini
import {
  Bus,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Shield,
  ArrowLeft,
} from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    confirmPassword: "",
  });

  const router = useRouter(); // 👉 inisialisasi router

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      try {
        const res = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "login",
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          alert(data.error || "Login gagal!");
          return;
        }

        // ✅ redirect ke halaman home
        const redirectTo = sessionStorage.getItem("redirectAfterLogin") || "/";
        router.push(redirectTo);

        // Hapus session storage biar tidak tersisa
        sessionStorage.removeItem("redirectAfterLogin");
      } catch (err) {
        console.error(err);
        alert("Terjadi error di server!");
      }
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert("Password dan konfirmasi password tidak sama!");
        return;
      }

      try {
        const res = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "signup",
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          alert(data.error || "Gagal daftar!");
          return;
        }

        alert("Daftar berhasil! Silakan login.");
        setIsLogin(true);
      } catch (err) {
        console.error(err);
        alert("Terjadi error di server!");
      }
    }
  };

  return (
    <div className="min-h-screen -mt-10 py-10 bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center p-4 text-gray-700">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-red-600 text-white p-3 rounded-lg">
              <Bus className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Timor Trave</h1>
          <p className="text-gray-600">
            {isLogin ? "Masuk ke akun Anda" : "Daftar akun baru"}
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Masukkan nama lengkap"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor Telepon
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="08xxxxxxxxxx"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="email@contoh.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Masukkan password"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konfirmasi Password
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Konfirmasi password"
                    required={!isLogin}
                    minLength={6}
                  />
                </div>
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-600">Ingat saya</span>
                </label>
                <a href="#" className="text-sm text-red-600 hover:text-red-700">
                  Lupa password?
                </a>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            >
              {isLogin ? "Masuk" : "Daftar"}
            </button>

            {isLogin && (
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Belum punya akun?{" "}
                  <button
                    type="button"
                    onClick={() => setIsLogin(false)}
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    Daftar di sini
                  </button>
                </p>
              </div>
            )}
          </form>

          {!isLogin && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Sudah punya akun?{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Masuk di sini
                </button>
              </p>
            </div>
          )}

          {/* Divider */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Atau lanjutkan dengan
                </span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <img src="/google.png" alt="Logo Google" className="h-5 w-5" />
                <span className="ml-2">Google</span>
              </button>

              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <img
                  src="/facebook.png"
                  alt="Logo Facebook"
                  className="h-5 w-5"
                />
                <span className="ml-2">Facebook</span>
              </button>
            </div>
          </div>
        </div>

        {/* Terms and Privacy */}
        {!isLogin && (
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Dengan mendaftar, Anda menyetujui{" "}
              <a href="#" className="text-red-600 hover:text-red-700">
                Syarat & Ketentuan
              </a>{" "}
              dan{" "}
              <a href="#" className="text-red-600 hover:text-red-700">
                Kebijakan Privasi
              </a>{" "}
              kami
            </p>
          </div>
        )}

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Kembali ke halaman utama
          </a>
        </div>
      </div>
    </div>
  );
}
