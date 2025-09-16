import { MapPin, Phone, Mail } from "lucide-react";

export default function Header() {
  return (
    <footer className="bg-gray-800 text-white py-12 px-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Timor Trave</h3>
            <p className="mb-4">
              Melayani perjalanan antar kota dengan kenyamanan dan keamanan
              terbaik.
            </p>
            <div className="flex space-x-4">
              <div className="bg-gray-700 p-2 rounded-full">
                <span className="sr-only">Facebook</span>
                <div className="h-5 w-5"></div>
              </div>
              <div className="bg-gray-700 p-2 rounded-full">
                <span className="sr-only">Instagram</span>
                <div className="h-5 w-5"></div>
              </div>
              <div className="bg-gray-700 p-2 rounded-full">
                <span className="sr-only">Twitter</span>
                <div className="h-5 w-5"></div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-4">Layanan</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-red-400">
                  Pesan Tiket
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-400">
                  Cek Jadwal
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-400">
                  Promo
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-400">
                  Cek Pesanan
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Informasi</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-red-400">
                  Tentang Kami
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-400">
                  Syarat & Ketentuan
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-400">
                  Kebijakan Privasi
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-red-400">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Kontak</h4>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                <span>+62 821 1234 5678</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                <span>info@timortrave.com</span>
              </li>
              <li className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                <span>Jl. Timor Raya No. 123, Kupang</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p>© 2023 Timor Trave. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
