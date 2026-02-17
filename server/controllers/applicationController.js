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
    const applications = await Application.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

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
