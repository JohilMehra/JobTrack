import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../utils/api";
import { getUpcomingFollowUps, processEmailImport } from "../utils/api";

import {
  Briefcase,
  FileText,
  Clock,
  CheckCircle,
  Trophy,
  XCircle,
  CalendarClock,
  Mail,
} from "lucide-react";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const Dashboard = () => {
  // ================= STATS STATE =================
  const [stats, setStats] = useState({
    total: 0,
    statusCounts: {
      Applied: 0,
      OA: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0,
    },
  });

  const [loading, setLoading] = useState(true);

  // ⭐ IMPORTANT — chart readiness guard
  const [chartReady, setChartReady] = useState(false);

  // ================= FOLLOWUPS STATE =================
  const [followUps, setFollowUps] = useState([]);
  const [loadingFollowUps, setLoadingFollowUps] = useState(true);

  // ================= EMAIL IMPORT STATE =================
  const [importingEmail, setImportingEmail] = useState(false);

  // ================= FETCH STATS =================
  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.get("/applications/stats");
      setStats(res.data);
    } catch (error) {
      toast.error("Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  // ================= FETCH FOLLOWUPS =================
  const fetchFollowUps = async () => {
    try {
      setLoadingFollowUps(true);
      const res = await getUpcomingFollowUps();
      setFollowUps(res.data);
    } catch (error) {
      console.error("Follow-ups fetch error:", error);
    } finally {
      setLoadingFollowUps(false);
    }
  };

  // ================= EMAIL SIMULATION =================
  const handleSimulateEmail = async () => {
    try {
      setImportingEmail(true);

      const sampleEmail = {
        subject: "Interview Invitation from Google",
        body: "We would like to schedule an interview for the Software Engineer role.",
        from: "careers@google.com",
      };

      const res = await processEmailImport(sampleEmail);

      if (res.data.action === "ignored") {
        toast("Email ignored (not job related)");
      } else if (res.data.action === "created") {
        toast.success("Application auto-created 🚀");
      } else if (res.data.action === "updated") {
        toast.success("Application status updated 🔄");
      }
      window.scrollTo({ top: 0, behavior: "smooth" });

      fetchStats();
      fetchFollowUps();
    } catch (error) {
      console.error(error);
      toast.error("Email import failed");
    } finally {
      setImportingEmail(false);
    }
  };

  // ================= EFFECT =================
  useEffect(() => {
    fetchStats();
    fetchFollowUps();
  }, []);

  // ⭐ CRITICAL FIX — delay chart mount one tick
  useEffect(() => {
    const timer = setTimeout(() => {
      setChartReady(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // ================= URGENCY CHECK =================
  const isUrgent = (date) => {
    const now = new Date();
    const followDate = new Date(date);
    const diffHours = (followDate - now) / (1000 * 60 * 60);
    return diffHours <= 24;
  };

  // ================= STATUS CARDS =================
  const statusCards = [
    {
      title: "Total Applications",
      value: stats.total,
      icon: <Briefcase className="text-indigo-600" size={22} />,
    },
    {
      title: "Applied",
      value: stats.statusCounts.Applied,
      icon: <FileText className="text-blue-600" size={22} />,
    },
    {
      title: "OA",
      value: stats.statusCounts.OA,
      icon: <Clock className="text-purple-600" size={22} />,
    },
    {
      title: "Interview",
      value: stats.statusCounts.Interview,
      icon: <CheckCircle className="text-yellow-600" size={22} />,
    },
    {
      title: "Offer",
      value: stats.statusCounts.Offer,
      icon: <Trophy className="text-green-600" size={22} />,
    },
    {
      title: "Rejected",
      value: stats.statusCounts.Rejected,
      icon: <XCircle className="text-red-600" size={22} />,
    },
  ];

  // ================= CHART DATA =================
  const chartData = [
    { name: "Applied", value: stats.statusCounts.Applied },
    { name: "OA", value: stats.statusCounts.OA },
    { name: "Interview", value: stats.statusCounts.Interview },
    { name: "Offer", value: stats.statusCounts.Offer },
    { name: "Rejected", value: stats.statusCounts.Rejected },
  ];

  const COLORS = ["#3b82f6", "#8b5cf6", "#facc15", "#22c55e", "#ef4444"];

  // ================= UI =================
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Analytics overview of your job applications.
          </p>
        </div>

        <button
          onClick={handleSimulateEmail}
          disabled={importingEmail}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-medium shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Mail size={16} />
          {importingEmail ? "Importing Email..." : "Simulate Email Import"}
        </button>
      </div>

      {loading ? (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-24 bg-gray-200 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : (
        <>
          {/* ================= Stats Cards ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
            {statusCards.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 sm:p-5
           hover:shadow-xl hover:-translate-y-1
           transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">{item.title}</p>
                  {item.icon}
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mt-3">
                  {item.value}
                </h2>
              </div>
            ))}
          </div>

          {/* ================= Chart ================= */}
          <div className="mt-6 w-full">
            <div className="w-full h-[320px] min-h-[320px] bg-white rounded-2xl shadow-md border border-gray-100 p-4">
              {!chartReady ? (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-400 text-sm">Preparing chart...</p>
                </div>
              ) : stats.total === 0 ? (
                <div className="h-full flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <p className="text-gray-400">No data available for chart</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* ================= FOLLOW UPS ================= */}
          <div className="mt-8 bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <CalendarClock className="text-indigo-600" size={22} />
              <h2 className="text-lg font-semibold text-gray-800">
                Upcoming Follow-Ups
              </h2>
            </div>

            {loadingFollowUps ? (
              <p className="text-sm text-gray-500">Loading follow-ups...</p>
            ) : followUps.length === 0 ? (
                <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-6 text-center">
                  <p className="text-3xl mb-2">📭</p>
                  <p className="text-sm font-medium text-gray-700">
                    No upcoming follow-ups
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    You're all caught up — nothing urgent right now 🎉
                  </p>
                </div>
              ) : (
              <div className="flex flex-col gap-3">
                {followUps.map((app) => (
                  <div
                    key={app._id}
                    className={`p-4 rounded-xl border transition-all duration-200
           hover:shadow-md ${
                      isUrgent(app.followUpDate)
                        ? "border-red-300 bg-red-50"
                        : "border-gray-200"
                    }`}
                  >
                    <p className="font-medium text-gray-800">
                      {app.companyName} — {app.role}
                    </p>
                    <p className="text-sm text-gray-500">
                      Follow-up:{" "}
                      {new Date(app.followUpDate).toLocaleDateString()}
                    </p>

                    {isUrgent(app.followUpDate) && (
                      <span className="text-xs font-semibold text-red-600">
                        ⚠ Urgent (within 24h)
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;