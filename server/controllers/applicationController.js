import Application from "../models/Application.js";
import mongoose from "mongoose";

const ensureHistory = (application) => {
  if (!Array.isArray(application.statusHistory)) {
    application.statusHistory = [];
  }
};

export const createApplication = async (req, res) => {
  try {
    const { companyName, role, status, appliedDate, location, notes, followUpDate } = req.body;

    if (!companyName || !role || !appliedDate) {
      return res.status(400).json({ success: false, message: "companyName, role, and appliedDate are required" });
    }

    const initialStatus = status || "Applied";

    const application = await Application.create({
      userId: req.user._id,
      companyName,
      role,
      status: initialStatus,
      appliedDate,
      location,
      notes,
      followUpDate,
      statusHistory: [{ status: initialStatus, date: new Date() }],
    });

    return res.status(201).json({ success: true, message: "Application created successfully", application });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getApplications = async (req, res) => {
  try {
    const { search, status, sort } = req.query;

    const query = { userId: req.user._id };

    if (status) query.status = status;

    if (search) {
      query.$or = [
        { companyName: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
      ];
    }

    const sortOption = sort === "oldest" ? { createdAt: 1 } : { createdAt: -1 };
    const applications = await Application.find(query).sort(sortOption);

    return res.status(200).json(applications);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid application ID" });
    }

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    if (application.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    return res.status(200).json(application);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateApplication = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, ...otherUpdates } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid application ID" });
    }

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    if (application.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    ensureHistory(application);

    if (status && status !== application.status) {
      const lastHistory = application.statusHistory[application.statusHistory.length - 1];
      if (!lastHistory || lastHistory.status !== status) {
        application.statusHistory.push({ status, date: new Date() });
      }
      application.status = status;
    }

    Object.keys(otherUpdates).forEach((key) => {
      application[key] = otherUpdates[key];
    });

    await application.save();

    return res.status(200).json({ success: true, message: "Application updated successfully", application });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid application ID" });
    }

    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    if (application.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await Application.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "Application deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getApplicationStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const total = await Application.countDocuments({ userId });

    const statusCountsArray = await Application.aggregate([
      { $match: { userId } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const statusCounts = { Applied: 0, OA: 0, Interview: 0, Offer: 0, Rejected: 0 };

    statusCountsArray.forEach((item) => {
      statusCounts[item._id] = item.count;
    });

    return res.status(200).json({ total, statusCounts });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getUpcomingFollowUps = async (req, res) => {
  try {
    const now = new Date();
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const applications = await Application.find({
      userId: req.user._id,
      followUpDate: { $gte: now, $lte: next24Hours },
    }).sort({ followUpDate: 1 });

    return res.status(200).json(applications);
  } catch {
    return res.status(500).json({ success: false, message: "Failed to load upcoming follow-ups" });
  }
};
