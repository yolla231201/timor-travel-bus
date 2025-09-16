"use client";

import { usePathname } from "next/navigation";
import Header from "./header/page";
import Footer from "./footer/page";

export default function ClientWrapper({ children }) {
  const pathname = usePathname();
  const showHeaderFooter = pathname !== "/login";

  return (
    <div className="min-h-screen bg-gray-50 pt-10">
      {showHeaderFooter && <Header />}
      {children}
      {showHeaderFooter && <Footer />}
    </div>
  );
}
