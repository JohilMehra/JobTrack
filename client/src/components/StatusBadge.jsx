import { AlertCircle, CheckCircle2, Clock3, FileText, Trophy, XCircle } from "lucide-react";

const STATUS_CONFIG = {
  Applied: {
    className: "border-slate-200 bg-slate-50 text-slate-700",
    icon: FileText,
  },
  OA: {
    className: "border-blue-200 bg-blue-50 text-blue-700",
    icon: Clock3,
  },
  Interview: {
    className: "border-amber-200 bg-amber-50 text-amber-700",
    icon: CheckCircle2,
  },
  Offer: {
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon: Trophy,
  },
  Rejected: {
    className: "border-rose-200 bg-rose-50 text-rose-700",
    icon: XCircle,
  },
};

const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || {
    className: "border-slate-200 bg-slate-50 text-slate-700",
    icon: AlertCircle,
  };

  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${config.className}`}>
      <Icon size={13} />
      {status}
    </span>
  );
};

export default StatusBadge;
