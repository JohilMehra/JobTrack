import StatusBadge from "./StatusBadge";
import { Pencil, Trash2, MapPin, Calendar } from "lucide-react";

const ApplicationCard = ({ application, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition">
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
    </div>
  );
};

export default ApplicationCard;
