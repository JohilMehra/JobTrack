// ======================================================
// 🎯 Keyword dictionaries
// ======================================================

const JOB_KEYWORDS = [
  "application",
  "interview",
  "assessment",
  "online test",
  "coding test",
  "offer",
  "regret",
  "unfortunately",
  "shortlisted",
  "next steps",
  "opportunity",
];

const STATUS_KEYWORDS = {
  OA: [
    "assessment",
    "online test",
    "coding test",
    "hackerrank",
    "codility",
  ],
  Interview: [
    "interview",
    "interview round",
    "technical interview",
    "hr interview",
    "schedule interview",
  ],
  Offer: [
    "offer letter",
    "we are pleased",
    "congratulations",
    "job offer",
  ],
  Rejected: [
    "unfortunately",
    "regret",
    "not moving forward",
    "not selected",
  ],
  Applied: [
    "application received",
    "thank you for applying",
    "we have received",
  ],
};

// ======================================================
// 🔍 Helpers
// ======================================================

const containsAny = (text, keywords) => {
  const lower = text.toLowerCase();
  return keywords.some((kw) => lower.includes(kw));
};

const detectStatus = (text) => {
  for (const [status, keywords] of Object.entries(STATUS_KEYWORDS)) {
    if (containsAny(text, keywords)) {
      return status;
    }
  }
  return null;
};

// very basic company guess (can improve later)
const detectCompany = (subject) => {
  // Example: "Amazon interview scheduled"
  const words = subject.split(" ");
  if (words.length > 0) {
    return words[0];
  }
  return null;
};

// ======================================================
// 🚀 Main parser
// ======================================================

export const parseJobEmail = ({ subject = "", body = "" }) => {
  const combinedText = `${subject} ${body}`.toLowerCase();

  // Step 1: is it job related?
  const isJobMail = containsAny(combinedText, JOB_KEYWORDS);

  if (!isJobMail) {
    return {
      isJobMail: false,
      detectedStatus: null,
      company: null,
    };
  }

  // Step 2: detect status
  const detectedStatus = detectStatus(combinedText) || "Applied";

  // Step 3: detect company (basic)
  const company = detectCompany(subject);

  return {
    isJobMail: true,
    detectedStatus,
    company,
  };
};