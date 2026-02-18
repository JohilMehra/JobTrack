import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../utils/api";

import {
  Briefcase,
  FileText,
  Clock,
  CheckCircle,
  Trophy,
  XCircle,
} from "lucide-react";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const Dashboard = () => {
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

  useEffect(() => {
    fetchStats();
  }, []);

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

  const chartData = [
    { name: "Applied", value: stats.statusCounts.Applied },
    { name: "OA", value: stats.statusCounts.OA },
    { name: "Interview", value: stats.statusCounts.Interview },
    { name: "Offer", value: stats.statusCounts.Offer },
    { name: "Rejected", value: stats.statusCounts.Rejected },
  ];

  const COLORS = ["#3b82f6", "#8b5cf6", "#facc15", "#22c55e", "#ef4444"];

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
          {/* Stats Cards */}
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

          {/* Charts */}
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
                  <p className="text-gray-400">No data available for chart</p>
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
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
