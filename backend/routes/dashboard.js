const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Project = require("../models/project");
const Task = require("../models/task");

// get task stats
router.get("/dashboard/tasks/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).populate("projects");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const project_count = user.projects.length;
    const total_tasks = await Task.countDocuments({ user: id });
    const total_tasks_completed = await Task.countDocuments({
      user: id,
      status: { $in: ["COMPLETE", "CLOSED"] },
    });
    const total_tasks_pending = total_tasks - total_tasks_completed;

    res.json({
      project_count,
      total_tasks,
      total_tasks_completed,
      total_tasks_pending,
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;
