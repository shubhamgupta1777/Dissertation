const express = require("express");
const router = express.Router();
const Objective = require("../models/objective");
const Deliverable = require("../models/deliverable");
const Task = require("../models/task");

// get all objectives
router.get("/objectives", async (req, res) => {
  try {
    const objectives = await Objective.find();
    res.json(objectives);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get objective by id
router.get("/objective/:id", getObjectiveByID, (req, res) => {
  res.json(res.objective);
});

// get objectives by projectId
router.get("/objective", async (req, res) => {
  let objective;
  const project = req.query.projectId;

  try {
    objective = await Objective.find({ project });

    if (objective) {
      res.json(objective);
    } else {
      res.status(404).send("Objective not found");
    }
  } catch (error) {
    console.error("Error fetching objective:", error);
    res.status(500).send("An error occurred while fetching objective");
  }
});

// create objective
router.post("/objective", async (req, res) => {
  try {
    let objective = new Objective({
      project: req.body.project,
      name: req.body.name,
      description: req.body.description,
      priority: req.body.priority,
    });
    objective = await objective.save();
    res.status(201).json(objective);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// update objective
router.patch("/objective/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    // Update the objective with the specified email
    const objective = await Objective.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (objective) {
      res.json(objective); // Send the updated objective as JSON response
    } else {
      res.status(404).send("objective not found");
    }
  } catch (error) {
    console.error("Error updating objective:", error);
    res.status(500).send("An error occurred while updating objective");
  }
});

// delete objective
router.delete("/objective/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const objective = await Objective.findById(id);

    if (!objective) {
      return res.status(404).json({ message: "Objective not found" });
    }

    const deliverables = await Deliverable.find({ objective: id });

    if (deliverables) {
      for (const deliverable of deliverables) {
        // Delete all tasks associated with the deliverable
        await Task.deleteMany({ deliverable: deliverable._id });
        // Delete the deliverable
        await Deliverable.findByIdAndDelete(deliverable._id);
      }

    }

    await Objective.findByIdAndDelete(id);

    res.status(200).json({
      message:
        "Objective and associated deliverables and tasks deleted successfully",
    });
  } catch (error) {
    console.error(
      "Error deleting objective and associated deliverables and tasks:",
      error
    );
    res.status(500).json({ message: "Internal server error" });
  }
});

async function getObjectiveByID(req, res, next) {
  let objective;
  try {
    objective = await Objective.findById(req.params.id);
    if (objective == null) {
      return res.status(404).json({ message: "Cannot find objective." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  res.objective = objective;
  next();
}

module.exports = router;
