const express = require("express");
const router = express.Router();
const Deliverable = require("../models/deliverable");

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

// get deliverables by objectivetId
router.get("/deliverable", async (req, res) => {
  let deliverable;
  const objective = req.query.objectiveId;

  try {
    deliverable = await Deliverable.find({ objective });

    if (deliverable) {
      res.json(deliverable);
    } else {
      res.status(404).send("deliverable not found");
    }
  } catch (error) {
    console.error("Error fetching deliverable:", error);
    res.status(500).send("An error occurred while fetching deliverable");
  }
});

// create a deliverable
router.post("/deliverable", async (req, res) => {
  try {
    let deliverable = new Deliverable({
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
});

// update a deliverable
router.patch("/deliverable/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
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
});

// delete a deliverable
router.delete("/deliverable/:id", async (req, res) => {
  try {
    const deliverable = await Deliverable.findByIdAndDelete(req.params.id);
    if (deliverable) {
      res.json(deliverable); // Send the updated deliverable as JSON response
    } else {
      res.status(404).send("deliverable not found");
    }
  } catch (error) {
    console.error("Error updating deliverable:", error);
    res.status(500).send("An error occurred while updating deliverable");
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

module.exports = router;
