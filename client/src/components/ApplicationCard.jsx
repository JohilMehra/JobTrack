import { Briefcase, Calendar, MapPin, Pencil, Trash2 } from "lucide-react";
import StatusBadge from "./StatusBadge";

const getProgressConfig = (status) => {
  switch (status) {
    case "Applied":
      return { width: "20%", gradient: "from-slate-500 to-slate-400" };
    case "OA":
      return { width: "40%", gradient: "from-blue-500 to-indigo-500" };
    case "Interview":
      return { width: "65%", gradient: "from-amber-500 to-orange-500" };
    case "Offer":
      return { width: "100%", gradient: "from-emerald-500 to-teal-500" };
    case "Rejected":
      return { width: "100%", gradient: "from-rose-500 to-red-500" };
    default:
      return { width: "0%", gradient: "from-slate-300 to-slate-300" };
  }
};

const ApplicationCard = ({ application, onEdit, onDelete }) => {
  const progress = getProgressConfig(application.status);

  return (
    <article className="group h-full rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="truncate text-lg font-semibold tracking-tight text-slate-900">{application.companyName}</h2>
          <p className="mt-1 text-sm text-slate-600">{application.role}</p>
        </div>
        <StatusBadge status={application.status} />
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <p className="flex items-center gap-2">
          <Calendar size={15} className="text-slate-400" />
          Applied: {application.appliedDate ? new Date(application.appliedDate).toLocaleDateString() : "N/A"}
        </p>

        {application.location && (
          <p className="flex items-center gap-2">
            <MapPin size={15} className="text-slate-400" />
            <span className="truncate">{application.location}</span>
          </p>
        )}

        {application.notes && (
          <p className="line-clamp-2 rounded-lg bg-slate-50 p-2 text-xs text-slate-500">{application.notes}</p>
        )}
      </div>

      <div className="mt-5">
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${progress.gradient} transition-all duration-700`}
            style={{ width: progress.width }}
          />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <button
          onClick={() => onEdit(application)}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:text-indigo-700"
        >
          <Pencil size={14} />
          Edit
        </button>
        <button
          onClick={() => onDelete(application._id)}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
        >
          <Trash2 size={14} />
          Delete
        </button>
      </div>

      <div className="mt-4 inline-flex items-center gap-1 text-xs text-slate-400">
        <Briefcase size={13} />
        Pipeline item
      </div>
    </article>
  );
};

export default ApplicationCard;
