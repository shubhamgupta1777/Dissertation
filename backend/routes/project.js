const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const Project = require("../models/project");
const User = require("../models/user");

// get all projects/ get all projects for a user
router.get("/projects", async (req, res) => {
  try {
    const user = await User.findById(req.query.userId).populate("projects");
    if (user) res.json(user.projects);
    else {
      const projects = await Project.find();
      res.json(projects);
    }
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// get project by id
router.get("/project/:id", getProjectByID, (req, res) => {
  res.json(res.project);
});

// get project by name
router.get("/project", getProjectsbyParams, (req, res) => {
  res.json(res.project);
});

const validateDates = (startDate, endDate) => {
  if (startDate && endDate && endDate < startDate) {
    throw new Error("End date must be same as or later than start date");
  }
  return true;
};

// create a project
router.post(
  "/project",
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
      const user = await User.findById(req.query.userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let project = new Project({
        name: req.body.name,
        description: req.body.description,
        startDate: req.body.startDate,
        deadLine: req.body.deadLine,
        status: req.body.status,
        createdBy: req.query.userId,
      });
      project = await project.save();

      user.projects.push(project);
      await user.save();

      res
        .status(201)
        .json({ message: "Project added successfully", project: project });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

// update a project
router.patch(
  "/project/:id",
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
      // Update the project with the specified email
      const project = await Project.findByIdAndUpdate(id, updates, {
        new: true,
      });

      if (project) {
        res.json(project); // Send the updated project as JSON response
      } else {
        res.status(404).send("project not found");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).send("An error occurred while updating project");
    }
  }
);

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
async function getProjectsbyParams(req, res, next) {
  let project;
  const name = req.query.name;

  try {
    if (name) project = await Project.findOne({ name });
    else res.json({ message: "API without parameters" });

    if (project) {
      res.project = project;
    } else {
      res.status(404).send("Project not found");
    }
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).send("An error occurred while fetching project");
  }

  next();
}

module.exports = router;
