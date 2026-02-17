const StatusBadge = ({ status }) => {
  const statusStyles = {
    Applied: "bg-blue-100 text-blue-700",
    OA: "bg-purple-100 text-purple-700",
    Interview: "bg-yellow-100 text-yellow-700",
    Offer: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        statusStyles[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
