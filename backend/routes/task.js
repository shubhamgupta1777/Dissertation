const express = require("express");
const router = express.Router();
const Task = require("../models/task");

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

// get tasks by deliverable id
router.get("/task", async (req, res) => {
  let task;
  const deliverable = req.query.deliverableId;

  try {
    task = await Task.find({ deliverable });

    if (task) {
      res.json(task);
    } else {
      res.status(404).send("task not found");
    }
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).send("An error occurred while fetching task");
  }
});

// create a task
router.post("/task", async (req, res) => {
  try {
    let task = new Task({
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
});

// update a task
router.patch("/task/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
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
});

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

module.exports = router;
