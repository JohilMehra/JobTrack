import { useEffect, useState } from "react";
import { X } from "lucide-react";

const ApplicationModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    companyName: "",
    role: "",
    status: "Applied",
    appliedDate: "",
    location: "",
    notes: "",
    followUpDate: "",
  });

  useEffect(() => {
    if (initialData) {
    setFormData({
      companyName: initialData.companyName || "",
      role: initialData.role || "",
      status: initialData.status || "Applied",
      appliedDate: initialData.appliedDate
        ? initialData.appliedDate.split("T")[0]
        : "",
      location: initialData.location || "",
      notes: initialData.notes || "",
      followUpDate: initialData.followUpDate
        ? initialData.followUpDate.split("T")[0]
        : "",
    });
  } else {
      setFormData({
        companyName: "",
        role: "",
        status: "Applied",
        appliedDate: "",
        location: "",
        notes: "",
        followUpDate: "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center px-4 py-6 z-50 overflow-y-auto">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
        >
          <X size={22} />
        </button>

        <h2 className="text-xl font-bold text-gray-800">
          {initialData ? "Edit Application" : "Add Application"}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Fill details of your job application.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Company Name *
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="e.g. Google"
              className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Role *
            </label>
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              placeholder="e.g. SDE Intern"
              className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Applied">Applied</option>
                <option value="OA">OA</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Applied Date *
              </label>
              <input
                type="date"
                name="appliedDate"
                value={formData.appliedDate}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          {/* Follow-up Date */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Follow-up Date (optional)
            </label>
            <input
              type="date"
              name="followUpDate"
              value={formData.followUpDate || ""}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Bangalore"
              className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Write notes..."
              rows={3}
              className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-500 transition shadow">
            {initialData ? "Update Application" : "Add Application"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplicationModal;
