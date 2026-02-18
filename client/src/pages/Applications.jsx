import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../utils/api";

import ApplicationCard from "../components/ApplicationCard";
import ApplicationModal from "../components/ApplicationModal";

import { Search } from "lucide-react";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("latest");

  // Fetch applications with query params
  const fetchApplications = async () => {
    try {
      setLoading(true);

      const res = await api.get("/applications", {
        params: {
          search: search || undefined,
          status: status || undefined,
          sort: sort || undefined,
        },
      });

      setApplications(res.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch applications"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [search, status, sort]);

  // Add application
  const handleAddApplication = async (formData) => {
    try {
      const res = await api.post("/applications", formData);

      toast.success("Application added successfully ✅");

      setIsModalOpen(false);

      // refresh list (because filters might be active)
      fetchApplications();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add application");
    }
  };

  // Edit application
  const handleEditApplication = async (formData) => {
    try {
      await api.put(`/applications/${editingApplication._id}`, formData);

      toast.success("Application updated successfully ✨");

      setEditingApplication(null);
      setIsModalOpen(false);

      fetchApplications();
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

      fetchApplications();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete application");
    }
  };

  const handleEditClick = (application) => {
    setEditingApplication(application);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingApplication(null);
    setIsModalOpen(true);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Applications</h1>
          <p className="text-gray-500 mt-1">
            Search, filter and manage your job applications.
          </p>
        </div>

        <button
          onClick={handleAddClick}
          className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-medium shadow hover:bg-indigo-500 transition"
        >
          + Add Application
        </button>
      </div>

      {/* Filters */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search by company or role..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none text-sm text-gray-700"
          />
        </div>

        {/* Status Filter */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm text-sm text-gray-700 outline-none"
        >
          <option value="">All Status</option>
          <option value="Applied">Applied</option>
          <option value="OA">OA</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm text-sm text-gray-700 outline-none"
        >
          <option value="latest">Sort: Latest</option>
          <option value="oldest">Sort: Oldest</option>
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <p className="mt-10 text-gray-500 text-center">
          Loading applications...
        </p>
      )}

      {/* Empty */}
      {!loading && applications.length === 0 && (
        <div className="mt-10 bg-white rounded-2xl shadow-md border border-gray-100 p-6 text-center">
          <h2 className="text-lg font-semibold text-gray-800">
            No Applications Found
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Try changing filters or add a new application.
          </p>
        </div>
      )}

      {/* Applications */}
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
