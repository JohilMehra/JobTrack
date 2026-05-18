import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Briefcase, LogOut, X } from "lucide-react";
import toast from "react-hot-toast";
import { removeToken } from "../utils/auth";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();

  const baseClass = "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition";

  const handleLogout = () => {
    removeToken();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <aside
      className={`fixed left-0 top-0 z-50 h-full w-64 border-r border-slate-800/70 bg-slate-950 text-white transition-transform duration-300 md:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between border-b border-white/10 p-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">JobTrack</h1>
          <p className="mt-1 text-xs text-slate-400">Career pipeline workspace</p>
        </div>

        <button onClick={() => setIsOpen(false)} className="rounded-md p-1 text-slate-300 hover:bg-white/10 md:hidden" aria-label="Close sidebar">
          <X size={20} />
        </button>
      </div>

      <nav className="flex flex-col gap-2 p-4">
        <NavLink
          to="/dashboard"
          onClick={() => setIsOpen(false)}
          className={({ isActive }) =>
            `${baseClass} ${isActive ? "bg-white/15 text-white" : "text-slate-300 hover:bg-white/10"}`
          }
        >
          <LayoutDashboard size={17} />
          Dashboard
        </NavLink>

        <NavLink
          to="/applications"
          onClick={() => setIsOpen(false)}
          className={({ isActive }) =>
            `${baseClass} ${isActive ? "bg-white/15 text-white" : "text-slate-300 hover:bg-white/10"}`
          }
        >
          <Briefcase size={17} />
          Applications
        </NavLink>
      </nav>

      <div className="absolute bottom-0 w-full border-t border-white/10 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10"
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
