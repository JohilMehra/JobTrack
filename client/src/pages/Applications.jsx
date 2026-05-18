import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BriefcaseBusiness, Plus, Search } from "lucide-react";
import api from "../utils/api";
import ApplicationCard from "../components/ApplicationCard";
import ApplicationModal from "../components/ApplicationModal";

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApplication, setEditingApplication] = useState(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("latest");

  const fetchApplications = useCallback(async () => {
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
      toast.error(error.response?.data?.message || "Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  }, [search, status, sort]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleAddApplication = async (formData) => {
    try {
      await api.post("/applications", formData);
      toast.success("Application added successfully");
      setIsModalOpen(false);
      fetchApplications();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add application");
    }
  };

  const handleEditApplication = async (formData) => {
    try {
      await api.put(`/applications/${editingApplication._id}`, formData);
      toast.success("Application updated successfully");
      setEditingApplication(null);
      setIsModalOpen(false);
      fetchApplications();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update application");
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this application?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/applications/${id}`);
      toast.success("Application deleted");
      fetchApplications();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete application");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Applications</h1>
          <p className="mt-1 text-sm text-slate-600">Search, filter, and manage your full application pipeline.</p>
        </div>

        <button
          onClick={() => {
            setEditingApplication(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
        >
          <Plus size={16} />
          Add Application
        </button>
      </div>

      <section className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3">
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search company or role"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-700 outline-none"
          />
        </div>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none"
        >
          <option value="">All Status</option>
          <option value="Applied">Applied</option>
          <option value="OA">OA</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none"
        >
          <option value="latest">Sort: Latest</option>
          <option value="oldest">Sort: Oldest</option>
        </select>
      </section>

      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, idx) => (
            <div key={idx} className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-white" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
            <BriefcaseBusiness className="text-slate-500" size={22} />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-slate-900">No applications found</h2>
          <p className="mt-1 text-sm text-slate-600">Try adjusting filters or create a new application entry.</p>
          <button
            onClick={() => {
              setEditingApplication(null);
              setIsModalOpen(true);
            }}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            <Plus size={15} />
            Add your first application
          </button>
        </section>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {applications.map((application) => (
            <ApplicationCard
              key={application._id}
              application={application}
              onEdit={(item) => {
                setEditingApplication(item);
                setIsModalOpen(true);
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingApplication}
        onSubmit={editingApplication ? handleEditApplication : handleAddApplication}
      />
    </div>
  );
};

export default Applications;
