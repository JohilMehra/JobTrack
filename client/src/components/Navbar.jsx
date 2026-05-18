import { UserCircle, Menu } from "lucide-react";
import { useLocation } from "react-router-dom";

const Navbar = ({ setIsOpen }) => {
  const location = useLocation();

  const getTitle = () => {
    if (location.pathname.includes("applications")) return "Applications";
    if (location.pathname.includes("dashboard")) return "Dashboard";
    return "JobTrack";
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsOpen(true)}
            className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 md:hidden"
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>

          <h2 className="text-base font-semibold tracking-tight text-slate-900 sm:text-lg">{getTitle()}</h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-slate-800">Johil</p>
            <p className="text-xs text-slate-500">Premium Workspace</p>
          </div>
          <UserCircle size={34} className="text-slate-600" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
