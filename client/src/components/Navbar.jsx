import { Search, UserCircle } from "lucide-react";

const Navbar = () => {
  return (
    <header className="h-16 w-full bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-gray-800">Dashboard</h2>
      </div>

      <div className="hidden md:flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-xl">
        <Search size={18} className="text-gray-500" />
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none text-sm text-gray-700 w-64"
        />
      </div>

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
