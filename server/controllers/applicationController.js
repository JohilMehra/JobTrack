import Application from "../models/Application.js";
import mongoose from "mongoose";

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

    const updatedApplication = await Application.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    return res.status(200).json({
      message: "Application updated successfully",
      application: updatedApplication,
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

