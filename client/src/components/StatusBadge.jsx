const StatusBadge = ({ status }) => {
  const statusStyles = {
    Applied: "bg-gray-100 text-gray-700",
    OA: "bg-blue-100 text-blue-700",
    Interview: "bg-purple-100 text-purple-700",
    Offer: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`
        ${statusStyles[status] || "bg-gray-100 text-gray-700"}
        px-3 py-1
        rounded-full
        text-xs font-medium
        shadow-sm
        whitespace-nowrap
        transition-all duration-200
      `}
    >
      {status}
    </span>
  );
};

export default StatusBadge;