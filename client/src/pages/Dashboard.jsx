import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../utils/api";

import {
  Briefcase,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  Trophy,
} from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    Applied: 0,
    OA: 0,
    Interview: 0,
    Offer: 0,
    Rejected: 0,
  });

  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);

      const res = await api.get("/applications");

      const applications = res.data;

      const counts = {
        total: applications.length,
        Applied: 0,
        OA: 0,
        Interview: 0,
        Offer: 0,
        Rejected: 0,
      };

      applications.forEach((app) => {
        if (counts[app.status] !== undefined) {
          counts[app.status]++;
        }
      });

      setStats(counts);
    } catch (error) {
      toast.error("Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const cards = [
    {
      title: "Total Applications",
      value: stats.total,
      icon: <Briefcase className="text-indigo-600" size={22} />,
    },
    {
      title: "Applied",
      value: stats.Applied,
      icon: <FileText className="text-blue-600" size={22} />,
    },
    {
      title: "OA",
      value: stats.OA,
      icon: <Clock className="text-purple-600" size={22} />,
    },
    {
      title: "Interviews",
      value: stats.Interview,
      icon: <CheckCircle className="text-yellow-600" size={22} />,
    },
    {
      title: "Offers",
      value: stats.Offer,
      icon: <Trophy className="text-green-600" size={22} />,
    },
    {
      title: "Rejected",
      value: stats.Rejected,
      icon: <XCircle className="text-red-600" size={22} />,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      <p className="text-gray-500 mt-1">
        Track your progress and application statistics.
      </p>

      {loading ? (
        <p className="mt-8 text-gray-500 text-center">Loading stats...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
          {cards.map((item, index) => (
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
      )}

      <div className="mt-8 bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Chart Analytics
        </h2>
        <p className="text-sm text-gray-500 mt-2">
          Charts will be added on Day 4 using Recharts.
        </p>

        <div className="mt-4 h-52 flex items-center justify-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-400">📊 Chart Placeholder</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
