import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* ===== MOBILE OVERLAY ===== */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* ===== SIDEBAR ===== */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* ===== MAIN AREA ===== */}
      <div className="md:ml-64 flex flex-col min-h-screen">
        <Navbar setIsOpen={setIsOpen} />

        <main className="flex-1 p-4 sm:p-6">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;