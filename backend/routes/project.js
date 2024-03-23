const express = require("express");
const router = express.Router();
const Project = require("../models/project");

// get all projects
router.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get project by id
router.get("/project/:id", getProjectByID, (req, res) => {
  res.json(res.project);
});

// get project by name
router.get("/project", async (req, res) => {
  let project;
  const name = req.query.name;

  try {
    project = await Project.findOne({ name });

    if (project) {
      res.project = project;
      res.status(200).json(project);
    } else {
      res.status(404).send("project not found");
    }
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).send("An error occurred while fetching project");
  }
});

// create a project
router.post("/project", async (req, res) => {
  try {
    let project = new Project({
      name: req.body.name,
      description: req.body.description,
      startDate: req.body.startDate,
      deadLine: req.body.deadLine,
      status: req.body.status,
    });
    project = await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// update a project
router.patch("/project/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    // Update the project with the specified email
    const project = await Project.findByIdAndUpdate(id, updates, { new: true });

    if (project) {
      res.json(project); // Send the updated project as JSON response
    } else {
      res.status(404).send("project not found");
    }
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).send("An error occurred while updating project");
  }
});

// delete a project
router.delete("/project/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (project) {
      res.json(project); // Send the updated project as JSON response
    } else {
      res.status(404).send("project not found");
    }
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).send("An error occurred while updating project");
  }
});

async function getProjectByID(req, res, next) {
  let project;
  try {
    project = await Project.findById(req.params.id);
    if (project == null) {
      return res.status(404).json({ message: "Cannot find project." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  res.project = project;
  next();
}

module.exports = router;
