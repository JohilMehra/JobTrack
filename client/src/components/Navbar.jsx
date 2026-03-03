import { UserCircle, Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

const Navbar = ({ setIsOpen }) => {
  const location = useLocation();

  // ✅ FIX — add dynamic title function
  const getTitle = () => {
    if (location.pathname.includes("applications")) return "Applications";
    if (location.pathname.includes("dashboard")) return "Dashboard";
    return "JobTrack";
  };

  return (
    <header className="h-16 w-full bg-white border-b border-gray-200 flex items-center justify-between px-6">
      
      {/* LEFT */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
        >
          <Menu size={22} />
        </button>

        <h2 className="text-lg font-semibold text-gray-800">
          {getTitle()}
        </h2>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-gray-800">Johil</p>
          <p className="text-xs text-gray-500">Free Plan</p>
        </div>

        <UserCircle size={38} className="text-gray-700" />
      </div>
    </header>
  );
};

export default Navbar;