import cron from "node-cron";
import Application from "../models/Application.js";

const startFollowUpCron = () => {
  // runs every hour at minute 0
  cron.schedule("0 * * * *", async () => {
    try {
      console.log("⏰ Running follow-up reminder cron...");

      const now = new Date();
      const next24Hours = new Date(
        now.getTime() + 24 * 60 * 60 * 1000
      );

      const upcoming = await Application.find({
        followUpDate: {
          $gte: now,
          $lte: next24Hours,
        },
      }).populate("userId", "email name");

      if (upcoming.length === 0) {
        console.log("✅ No upcoming follow-ups.");
        return;
      }

      console.log("🔔 Upcoming follow-ups:");

      upcoming.forEach((app) => {
        console.log(
          `Reminder → ${app.companyName} | ${app.role} | ${app.userId?.email} | ${app.followUpDate}`
        );
      });
    } catch (error) {
      console.error("❌ Cron error:", error.message);
    }
  });
};

export default startFollowUpCron;