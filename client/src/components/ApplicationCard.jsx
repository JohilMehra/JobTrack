import StatusBadge from "./StatusBadge";
import { Pencil, Trash2, MapPin, Calendar } from "lucide-react";

const getProgressConfig = (status) => {
  switch (status) {
    case "Applied":
      return { width: "20%", color: "bg-gray-500", percent: 20 };
    case "OA":
      return { width: "40%", color: "bg-blue-600", percent: 40 };
    case "Interview":
      return { width: "60%", color: "bg-purple-600", percent: 60 };
    case "Offer":
      return { width: "100%", color: "bg-emerald-500", percent: 100 };
    case "Rejected":
      return { width: "100%", color: "bg-red-500", percent: 100 };
    default:
      return { width: "0%", color: "bg-gray-300", percent: 0 };
  }
};

const ApplicationCard = ({ application, onEdit, onDelete }) => {
    const progress = getProgressConfig(application.status);
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-gray-800">
            {application.companyName}
          </h2>
          <p className="text-sm text-gray-500 mt-1">{application.role}</p>
        </div>

        <StatusBadge status={application.status} />
      </div>

      <div className="flex flex-col gap-2 mt-4 text-sm text-gray-600">
        <p className="flex items-center gap-2">
          <Calendar size={16} className="text-gray-500" />
          Applied:{" "}
          {application.appliedDate
            ? new Date(application.appliedDate).toLocaleDateString()
            : "N/A"}
        </p>

        {application.location && (
          <p className="flex items-center gap-2">
            <MapPin size={16} className="text-gray-500" />
            {application.location}
          </p>
        )}

        {application.notes && (
          <p className="text-gray-500 mt-2 line-clamp-2">
            📝 {application.notes}
          </p>
        )}
      </div>

      <div className="flex gap-3 mt-5">
        <button
          onClick={() => onEdit(application)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition"
        >
          <Pencil size={16} />
          Edit
        </button>

        <button
          onClick={() => onDelete(application._id)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-500 transition"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
      {/* Premium Progress Bar */}
        <div className="mt-4">
          <div className="w-full h-2 bg-gray-200/70 rounded-full overflow-hidden">
            <div
              className={`
                h-full
                ${progress.color}
                rounded-full
                transition-all duration-700 ease-out
                relative
              `}
              style={{ width: progress.width }}
            >
              {/* subtle shine */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-40" />
            </div>
          </div>
        </div>
      </div>
  );
};

export default ApplicationCard;
