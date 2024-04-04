const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const Deliverable = require("../models/deliverable");
const Task = require("../models/task");

// get all deliverables
router.get("/deliverables", async (req, res) => {
  try {
    const deliverables = await Deliverable.find();
    res.json(deliverables);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get deliverable by id
router.get("/deliverable/:id", getDeliverableByID, (req, res) => {
  res.json(res.deliverable);
});

// get tasks by project id/ objective id
router.get("/deliverable", getDeliverablesbyParams, (req, res) => {
  res.json(res.deliverable);
});

const validateDates = (startDate, endDate) => {
  if (startDate && endDate && endDate < startDate) {
    throw new Error("End date must be same as or later than start date");
  }
  return true;
};

// create a deliverable
router.post(
  "/deliverable",
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

      let deliverable = new Deliverable({
        project: req.body.project,
        objective: req.body.objective,
        name: req.body.name,
        description: req.body.description,
        startDate: req.body.startDate,
        deadLine: req.body.deadLine,
        priority: req.body.priority,
        status: req.body.status,
      });
      deliverable = await deliverable.save();
      res.status(201).json(deliverable);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// update a deliverable
router.patch(
  "/deliverable/:id",
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

      // Update the deliverable with the specified email
      const deliverable = await Deliverable.findByIdAndUpdate(id, updates, {
        new: true,
      });

      if (deliverable) {
        res.json(deliverable); // Send the updated deliverable as JSON response
      } else {
        res.status(404).send("deliverable not found");
      }
    } catch (error) {
      console.error("Error updating deliverable:", error);
      res.status(500).send("An error occurred while updating deliverable");
    }
  }
);

// delete a deliverable
router.delete("/deliverable/:id", async (req, res) => {
  const id = req.params.id;
  try {
    let deliverable = await Deliverable.findById(id);

    if (!deliverable) {
      return res.status(404).json({ message: "Deliverable not found" });
    }

    const tasks = await Task.find({ deliverable: id });
    await Task.deleteMany({ deliverable: id });

    deliverable = await Deliverable.findByIdAndDelete(id);
    
    if (deliverable) {
      res.status(200).json({ message: 'Deliverable and associated tasks deleted successfully' });
    } else {
      res.status(404).send("deliverable not found");
    }
  } catch (error) {
    console.error("Error deleting deliverable:", error);
    res.status(500).send("An error occurred while deleting deliverable");
  }
});

async function getDeliverableByID(req, res, next) {
  let deliverable;
  try {
    deliverable = await Deliverable.findById(req.params.id);
    if (deliverable == null) {
      return res.status(404).json({ message: "Cannot find deliverable." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  res.deliverable = deliverable;
  next();
}

async function getDeliverablesbyParams(req, res, next) {
  let deliverable;
  const project = req.query.projectId;
  const objective = req.query.objectiveId;

  try {
    if (project) deliverable = await Deliverable.find({ project });
    else if (objective) deliverable = await Deliverable.find({ objective });
    else res.json({ message: "API without parameters" });

    if (deliverable) {
      res.deliverable = deliverable;
    } else {
      res.status(404).send("Deliverable not found");
    }
  } catch (error) {
    console.error("Error fetching deliverable:", error);
    res.status(500).send("An error occurred while fetching deliverable");
  }

  next();
}

module.exports = router;
