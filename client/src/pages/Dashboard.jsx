import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import api, { getUpcomingFollowUps } from "../utils/api";
import {
  Briefcase,
  FileText,
  Clock,
  CheckCircle,
  Trophy,
  XCircle,
  CalendarClock,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const CHART_COLORS = ["#5B6CFF", "#22C55E", "#F59E0B", "#10B981", "#EF4444"];

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
  const [followUps, setFollowUps] = useState([]);
  const [loadingFollowUps, setLoadingFollowUps] = useState(true);
  const [chartWidth, setChartWidth] = useState(0);
  const chartWrapperRef = useRef(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/applications/stats");
      setStats(res.data);
    } catch {
      toast.error("Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFollowUps = useCallback(async () => {
    try {
      setLoadingFollowUps(true);
      const res = await getUpcomingFollowUps();
      setFollowUps(res.data);
    } catch {
      toast.error("Failed to load upcoming follow-ups");
    } finally {
      setLoadingFollowUps(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchFollowUps();
  }, [fetchStats, fetchFollowUps]);

  useEffect(() => {
    if (!chartWrapperRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const nextWidth = entries[0]?.contentRect?.width ?? 0;
      setChartWidth(nextWidth);
    });

    observer.observe(chartWrapperRef.current);
    return () => observer.disconnect();
  }, []);

  const isUrgent = (date) => {
    const diffHours = (new Date(date) - new Date()) / (1000 * 60 * 60);
    return diffHours <= 24;
  };

  const statusCards = [
    {
      title: "Total Applications",
      value: stats.total,
      note: "All tracked opportunities",
      icon: <Briefcase className="text-indigo-600" size={20} />,
    },
    {
      title: "Applied",
      value: stats.statusCounts.Applied,
      note: "Application confirmations",
      icon: <FileText className="text-blue-600" size={20} />,
    },
    {
      title: "OA",
      value: stats.statusCounts.OA,
      note: "Assessments pending",
      icon: <Clock className="text-emerald-600" size={20} />,
    },
    {
      title: "Interview",
      value: stats.statusCounts.Interview,
      note: "Interview pipeline",
      icon: <CheckCircle className="text-amber-600" size={20} />,
    },
    {
      title: "Offer",
      value: stats.statusCounts.Offer,
      note: "Positive outcomes",
      icon: <Trophy className="text-green-600" size={20} />,
    },
    {
      title: "Rejected",
      value: stats.statusCounts.Rejected,
      note: "Closed opportunities",
      icon: <XCircle className="text-rose-600" size={20} />,
    },
  ];

  const chartData = useMemo(
    () => [
      { name: "Applied", value: stats.statusCounts.Applied },
      { name: "OA", value: stats.statusCounts.OA },
      { name: "Interview", value: stats.statusCounts.Interview },
      { name: "Offer", value: stats.statusCounts.Offer },
      { name: "Rejected", value: stats.statusCounts.Rejected },
    ],
    [stats.statusCounts]
  );

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-indigo-50 p-6 shadow-sm sm:p-8">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-sky-200/40 blur-2xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-white/80 px-3 py-1 text-xs font-semibold text-indigo-700">
              <Sparkles size={14} />
              JobTrack Workspace
            </p>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Welcome back. Here is your pipeline health.</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">Stay focused on follow-ups and keep momentum with a clear view of every stage.</p>
          </div>

          <Link
            to="/applications"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-slate-800"
          >
            Manage Applications
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-white" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {statusCards.map((item) => (
            <article
              key={item.title}
              className="group rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-600">{item.title}</p>
                <div className="rounded-lg border border-slate-100 bg-slate-50 p-2">{item.icon}</div>
              </div>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{item.value}</p>
              <p className="mt-1 text-xs text-slate-500">{item.note}</p>
            </article>
          ))}
        </div>
      )}

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <div ref={chartWrapperRef} className="h-[340px] rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <div className="mb-3">
              <h2 className="text-base font-semibold text-slate-900">Status Distribution</h2>
              <p className="text-xs text-slate-500">Live breakdown of your application stages</p>
            </div>

            {stats.total === 0 ? (
              <div className="flex h-[270px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-center">
                <Briefcase size={28} className="text-slate-400" />
                <p className="mt-3 text-sm font-medium text-slate-700">No chart data yet</p>
                <p className="mt-1 text-xs text-slate-500">Add your first application to visualize progress.</p>
              </div>
            ) : chartWidth < 16 ? (
              <div className="flex h-[270px] items-center justify-center text-sm text-slate-400">Preparing chart...</div>
            ) : (
              <ResponsiveContainer width="100%" height={270}>
                <PieChart>
                  <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95} label>
                    {chartData.map((entry, index) => (
                      <Cell key={entry.name} fill={CHART_COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="xl:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <CalendarClock className="text-indigo-600" size={20} />
              <h2 className="text-base font-semibold text-slate-900">Upcoming Follow-Ups</h2>
            </div>

            {loadingFollowUps ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
                ))}
              </div>
            ) : followUps.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                <p className="text-sm font-medium text-slate-700">No follow-ups due soon</p>
                <p className="mt-1 text-xs text-slate-500">You are fully caught up for the next 24 hours.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {followUps.map((app) => (
                  <article
                    key={app._id}
                    className={`rounded-xl border p-4 transition ${
                      isUrgent(app.followUpDate)
                        ? "border-rose-200 bg-rose-50"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <p className="text-sm font-semibold text-slate-900">{app.companyName}</p>
                    <p className="text-xs text-slate-500">{app.role}</p>
                    <p className="mt-2 text-xs text-slate-600">Follow-up: {new Date(app.followUpDate).toLocaleDateString()}</p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
