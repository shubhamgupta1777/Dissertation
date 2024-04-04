const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const Task = require("../models/task");
const User = require("../models/user");

const validateDates = (startDate, endDate) => {
  if (startDate && endDate && endDate < startDate) {
    throw new Error("End date must be same as or later than start date");
  }
  return true;
};

// get all tasks
router.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get task by id
router.get("/task/:id", getTaskByID, (req, res) => {
  res.json(res.task);
});

// get tasks by project id/ deliverable id
router.get("/task", getTasksbyParams, (req, res) => {
  res.json(res.task);
});

// get assigned user by task id
router.get("/task/:id/user", async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const user = await User.findById(task.user);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Error finding user by task ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// create a task
router.post(
  "/task",
  [
    body("startDate").isDate().withMessage("Start date must be a valid date"),
    body("deadLine")
      .isDate()
      .withMessage("End date must be a valid date")
      .custom((endDate, { req }) => validateDates(req.body.startDate, endDate)),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      let task = new Task({
        project: req.body.project,
        deliverable: req.body.deliverable,
        user: req.body.user,
        name: req.body.name,
        description: req.body.description,
        startDate: req.body.startDate,
        deadLine: req.body.deadLine,
        priority: req.body.priority,
        status: req.body.status,
      });
      task = await task.save();
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// update a task
router.patch(
  "/task/:id",
  [
    body("startDate").isDate().withMessage("Start date must be a valid date"),
    body("deadLine")
      .isDate()
      .withMessage("End date must be a valid date")
      .custom((endDate, { req }) => validateDates(req.body.startDate, endDate)),
  ],
  async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      // Update the task with the specified email
      const task = await Task.findByIdAndUpdate(id, updates, {
        new: true,
      });

      if (task) {
        res.json(task); // Send the updated task as JSON response
      } else {
        res.status(404).send("task not found");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).send("An error occurred while updating task");
    }
  }
);

// delete a task
router.delete("/task/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (task) {
      res.json(task); // Send the updated task as JSON response
    } else {
      res.status(404).send("task not found");
    }
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).send("An error occurred while updating task");
  }
});

async function getTaskByID(req, res, next) {
  let task;
  try {
    task = await Task.findById(req.params.id);
    if (task == null) {
      return res.status(404).json({ message: "Cannot find task." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  res.task = task;
  next();
}

async function getTasksbyParams(req, res, next) {
  let task;
  const project = req.query.projectId;
  const deliverable = req.query.deliverableId;

  try {
    if (project) task = await Task.find({ project });
    else if (deliverable) task = await Task.find({ deliverable });
    else res.json({ message: "API without parameters" });

    if (task) {
      res.task = task;
    } else {
      res.status(404).send("Task not found");
    }
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).send("An error occurred while fetching task");
  }

  next();
}

module.exports = router;
