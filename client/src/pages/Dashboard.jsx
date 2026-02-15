import { Briefcase, CheckCircle, Clock, XCircle } from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Applications",
      value: 12,
      icon: <Briefcase className="text-indigo-600" size={22} />,
    },
    {
      title: "Applied",
      value: 6,
      icon: <Clock className="text-blue-600" size={22} />,
    },
    {
      title: "Interviews",
      value: 3,
      icon: <CheckCircle className="text-green-600" size={22} />,
    },
    {
      title: "Rejected",
      value: 3,
      icon: <XCircle className="text-red-600" size={22} />,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      <p className="text-gray-500 mt-1">
        Track your progress and application statistics.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
        {stats.map((item, index) => (
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
