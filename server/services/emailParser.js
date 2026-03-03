// ===============================
// JobTrack Email Parser (Rule-Based MVP)
// ===============================

// ---------- Keyword Dictionaries ----------

const JOB_KEYWORDS = [
  "application",
  "applied",
  "opportunity",
  "position",
  "role",
  "career",
  "hiring",
  "recruit",
  "interview",
  "assessment",
  "offer",
];

const STATUS_KEYWORDS = {
  Applied: [
    "application received",
    "thanks for applying",
    "we received your application",
    "application submitted",
    "successfully applied",
  ],

  OA: [
    "online assessment",
    "coding assessment",
    "take home test",
    "complete the assessment",
    "hackerrank",
    "codility",
    "test link",
  ],

  Interview: [
    "interview",
    "schedule a call",
    "technical round",
    "hr round",
    "interview invitation",
    "interview scheduled",
  ],

  Offer: [
    "offer letter",
    "we are pleased to offer",
    "congratulations",
    "job offer",
    "pleased to inform",
  ],

  Rejected: [
    "regret to inform",
    "unfortunately",
    "not moving forward",
    "not selected",
    "application was not successful",
  ],
};

// ---------- Helpers ----------

const normalizeText = (text = "") => text.toLowerCase();

// ---------- Detect Job Email ----------

const detectJobMail = (subject, body) => {
  const text = normalizeText(subject + " " + body);

  return JOB_KEYWORDS.some((keyword) => text.includes(keyword));
};

// ---------- Detect Status ----------

const detectStatus = (subject, body) => {
  const text = normalizeText(subject + " " + body);

  for (const status of Object.keys(STATUS_KEYWORDS)) {
    const keywords = STATUS_KEYWORDS[status];

    if (keywords.some((kw) => text.includes(kw))) {
      return status;
    }
  }

  return null;
};

// ---------- Extract Company (MVP heuristic) ----------

const extractCompanyFromEmail = (from = "") => {
  try {
    // Example: careers@google.com → google
    const domainMatch = from.split("@")[1];
    if (!domainMatch) return null;

    const company = domainMatch.split(".")[0];
    if (!company) return null;

    // Capitalize first letter
    return company.charAt(0).toUpperCase() + company.slice(1);
  } catch {
    return null;
  }
};

// ---------- Main Parser ----------

export const parseJobEmail = ({ subject, body, from }) => {
  try {
    // 1️⃣ detect if job related
    const isJobMail = detectJobMail(subject, body);

    if (!isJobMail) {
      return {
        isJobMail: false,
        detectedStatus: null,
        company: null,
      };
    }

    // 2️⃣ detect status
    const detectedStatus = detectStatus(subject, body) || "Applied";

    // 3️⃣ extract company
    const company =
      extractCompanyFromEmail(from) || "Unknown Company";

    return {
      isJobMail: true,
      detectedStatus,
      company,
    };
  } catch (error) {
    console.error("Email parser error:", error);

    return {
      isJobMail: false,
      detectedStatus: null,
      company: null,
    };
  }
};