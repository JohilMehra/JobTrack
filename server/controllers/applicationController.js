import Application from "../models/Application.js";
import mongoose from "mongoose";
import { parseJobEmail } from "../services/emailParser.js";
// ==========================
// POST /api/applications
// Add new application
// ==========================
export const createApplication = async (req, res) => {
  try {
    const { companyName, role, status, appliedDate, location, notes } = req.body;

    // Validation
    if (!companyName || !role || !appliedDate) {
      return res.status(400).json({
        message: "companyName, role, and appliedDate are required",
      });
    }

    const application = await Application.create({
      userId: req.user._id, // comes from authMiddleware
      companyName,
      role,
      status,
      appliedDate,
      location,
      notes,
      statusHistory: [
        {
          status: status,
          date: new Date()
        }
      ]
    });

    return res.status(201).json({
      message: "Application created successfully",
      application,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ==========================
// GET /api/applications
// Get all applications
// ==========================
export const getApplications = async (req, res) => {
  try {
    const { search, status, sort } = req.query;

    // Base filter: only logged in user's applications
    let query = {
      userId: req.user._id,
    };

    // Status filter
    if (status) {
      query.status = status;
    }

    // Search filter (companyName OR role)
    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
      ];
    }

    // Sorting
    let sortOption = { createdAt: -1 }; // default latest
    if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    }

    const applications = await Application.find(query).sort(sortOption);

    return res.status(200).json(applications);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// ==========================
// GET /api/applications/:id
// Get single application
// ==========================
export const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid application ID" });
    }

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Security check
    if (application.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    return res.status(200).json(application);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ==========================
// PUT /api/applications/:id
// Update application
// ==========================
export const updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, ...otherUpdates } = req.body;

    // ✅ Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid application ID" });
    }

    // ✅ Find application first (IMPORTANT)
    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // ✅ Security check
    if (application.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // =================================================
    // ⭐ SMART STATUS HISTORY LOGIC
    // =================================================
    if (status && status !== application.status) {
      const lastHistory =
        application.statusHistory[
          application.statusHistory.length - 1
        ];

      // ✅ prevent duplicate consecutive status
      if (!lastHistory || lastHistory.status !== status) {
        application.statusHistory.push({
          status: status,
          date: new Date(),
        });
      }

      // update current status
      application.status = status;
    }

    // =================================================
    // ⭐ Update other fields safely
    // =================================================
    Object.keys(otherUpdates).forEach((key) => {
      application[key] = otherUpdates[key];
    });

    // ✅ Save document
    await application.save();

    return res.status(200).json({
      message: "Application updated successfully",
      application,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ==========================
// DELETE /api/applications/:id
// Delete application
// ==========================
export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid application ID" });
    }

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // Security check
    if (application.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Application.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Application deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ==========================
// GET /api/applications/stats
// Dashboard statistics
// ==========================
export const getApplicationStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const total = await Application.countDocuments({ userId });

    const statusCountsArray = await Application.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Convert array into object
    const statusCounts = {
      Applied: 0,
      OA: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0,
    };

    statusCountsArray.forEach((item) => {
      statusCounts[item._id] = item.count;
    });

    return res.status(200).json({
      total,
      statusCounts,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


//get Upcoming Follow Ups controller 
export const getUpcomingFollowUps = async (req, res) => {
  try {
    const now = new Date();
    const next24Hours = new Date(
      now.getTime() + 24 * 60 * 60 * 1000
    );

    const applications = await Application.find({
      userId: req.user.id,
      followUpDate: {
        $gte: now,
        $lte: next24Hours,
      },
    }).sort({ followUpDate: 1 });

    res.json(applications);
  } catch (error) {
    console.error("Upcoming follow-ups error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// ===============================
// Process Email → Auto Application
// ===============================
export const processEmail = async (req, res) => {
  try {
    const { subject, body, from } = req.body;

    // ---------- Basic validation ----------
    if (!subject || !body || !from) {
      return res.status(400).json({
        message: "subject, body, and from are required",
      });
    }

    // ---------- Run parser ----------
    const result = parseJobEmail({ subject, body, from });

    // ---------- Ignore non-job emails ----------
    if (!result.isJobMail) {
      return res.json({
        action: "ignored",
        reason: "Not a job-related email",
      });
    }

    const { detectedStatus, company } = result;

    // ---------- Duplicate check ----------
    // For MVP we use role placeholder
    const role = "Software Role";

    let application = await Application.findOne({
      userId: req.user.id,
      companyName: company,
      role,
    });

    // ===============================
    // CASE 1 — Application exists → UPDATE
    // ===============================
    if (application) {
      const lastStatus =
        application.statusHistory[
          application.statusHistory.length - 1
        ]?.status;

      // Prevent duplicate consecutive status
      if (lastStatus !== detectedStatus) {
        application.statusHistory.push({
          status: detectedStatus,
          date: new Date(),
        });

        application.status = detectedStatus;
        await application.save();
      }

      return res.json({
        action: "updated",
        applicationId: application._id,
      });
    }

    // ===============================
    // CASE 2 — Create new application
    // ===============================
    application = await Application.create({
      userId: req.user.id,
      companyName: company,
      role,
      status: detectedStatus,
      appliedDate: new Date(),
      statusHistory: [
        {
          status: detectedStatus,
          date: new Date(),
        },
      ],
      source: "email-auto",
    });

    return res.json({
      action: "created",
      applicationId: application._id,
    });
  } catch (error) {
    console.error("processEmail error:", error);
    res.status(500).json({ message: "Server error" });
  }
};