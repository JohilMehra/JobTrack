import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Briefcase, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { removeToken } from "../utils/auth";

const Sidebar = () => {
  const navigate = useNavigate();

  const baseClass =
    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition";

  const handleLogout = () => {
    removeToken();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <aside className="hidden md:flex md:flex-col w-64 min-h-screen bg-slate-900 text-white border-r border-white/10">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-bold tracking-wide">JobTrack</h1>
        <p className="text-xs text-gray-400 mt-1">
          Track your job applications
        </p>
      </div>

      <nav className="flex-1 p-4 flex flex-col gap-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `${baseClass} ${
              isActive
                ? "bg-indigo-600 text-white"
                : "text-gray-300 hover:bg-white/10"
            }`
          }
        >
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink
          to="/applications"
          className={({ isActive }) =>
            `${baseClass} ${
              isActive
                ? "bg-indigo-600 text-white"
                : "text-gray-300 hover:bg-white/10"
            }`
          }
        >
          <Briefcase size={18} />
          Applications
        </NavLink>
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/10 transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
