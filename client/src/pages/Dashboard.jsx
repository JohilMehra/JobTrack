import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api, { getUpcomingFollowUps } from "../utils/api";

import {
  Briefcase,
  FileText,
  Clock,
  CheckCircle,
  Trophy,
  XCircle,
  CalendarClock,
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

  // ================= FOLLOWUPS STATE =================
  const [followUps, setFollowUps] = useState([]);
  const [loadingFollowUps, setLoadingFollowUps] = useState(true);

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
      const res = await getUpcomingFollowUps();
      setFollowUps(res.data);
    } catch (error) {
      console.error("Follow-ups fetch error:", error);
    } finally {
      setLoadingFollowUps(false);
    }
  };

  // ================= EFFECT =================
  useEffect(() => {
    fetchStats();
    fetchFollowUps();
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
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      <p className="text-gray-500 mt-1">
        Analytics overview of your job applications.
      </p>

      {loading ? (
        <p className="mt-8 text-gray-500 text-center">Loading stats...</p>
      ) : (
        <>
          {/* ================= Stats Cards ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
            {statusCards.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 hover:shadow-lg transition"
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
          <div className="mt-8 bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800">
              Status Distribution
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Breakdown of applications by status.
            </p>

            <div className="mt-6 h-72">
              {stats.total === 0 ? (
                <div className="h-full flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                  <p className="text-gray-400">
                    No data available for chart
                  </p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
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

          {/* ================= FOLLOW UPS WIDGET ================= */}
          <div className="mt-8 bg-white rounded-2xl shadow-md border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <CalendarClock className="text-indigo-600" size={22} />
              <h2 className="text-lg font-semibold text-gray-800">
                Upcoming Follow-Ups
              </h2>
            </div>

            {loadingFollowUps ? (
              <p className="text-sm text-gray-500">
                Loading follow-ups...
              </p>
            ) : followUps.length === 0 ? (
              <p className="text-sm text-gray-500">
                No upcoming follow-ups 🎉
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {followUps.map((app) => (
                  <div
                    key={app._id}
                    className={`p-4 rounded-xl border ${
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
                      {new Date(
                        app.followUpDate
                      ).toLocaleDateString()}
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