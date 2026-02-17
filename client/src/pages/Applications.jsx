import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../utils/api";

import ApplicationCard from "../components/ApplicationCard";
import ApplicationModal from "../components/ApplicationModal";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);

  // Fetch all applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await api.get("/applications");
      setApplications(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Add new application
  const handleAddApplication = async (formData) => {
    try {
      const res = await api.post("/applications", formData);

      toast.success("Application added successfully ✅");

      setApplications((prev) => [res.data.application, ...prev]);
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add application");
    }
  };

  // Edit application
  const handleEditApplication = async (formData) => {
    try {
      const res = await api.put(
        `/applications/${editingApplication._id}`,
        formData
      );

      toast.success("Application updated successfully ✨");

      setApplications((prev) =>
        prev.map((app) =>
          app._id === editingApplication._id ? res.data.application : app
        )
      );

      setEditingApplication(null);
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update application");
    }
  };

  // Delete application
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/applications/${id}`);

      toast.success("Application deleted 🗑️");

      setApplications((prev) => prev.filter((app) => app._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete application");
    }
  };

  // Open modal for edit
  const handleEditClick = (application) => {
    setEditingApplication(application);
    setIsModalOpen(true);
  };

  // Open modal for add
  const handleAddClick = () => {
    setEditingApplication(null);
    setIsModalOpen(true);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Applications</h1>
          <p className="text-gray-500 mt-1">
            Manage all your job applications here.
          </p>
        </div>

        <button
          onClick={handleAddClick}
          className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-medium shadow hover:bg-indigo-500 transition"
        >
          + Add Application
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <p className="mt-8 text-gray-500 text-center">Loading applications...</p>
      )}

      {/* Empty State */}
      {!loading && applications.length === 0 && (
        <div className="mt-8 bg-white rounded-2xl shadow-md border border-gray-100 p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-800">
            No Applications Found
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Start by adding your first job application.
          </p>
        </div>
      )}

      {/* Applications List */}
      {!loading && applications.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
          {applications.map((application) => (
            <ApplicationCard
              key={application._id}
              application={application}
              onEdit={handleEditClick}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingApplication}
        onSubmit={
          editingApplication ? handleEditApplication : handleAddApplication
        }
      />
    </div>
  );
};

export default Applications;
