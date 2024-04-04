const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Project = require("../models/project");

// get all users/ get all users with same project
router.get("/users", async (req, res) => {
  let users;
  const projectId = req.query.projectId;
  try {
    if (projectId) {
      users = await User.find({ projects: projectId });
      res.json(users)
    } else {
      users = await User.find();
      res.json(users);
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// get user by id
router.get("/user/:id", getUserbyID, (req, res) => {
  res.json(res.user);
});

// user auth
router.get("/user", getUserbyParams, (req, res) => {
  res.json(res.user);
});

// create a user
router.post("/user", async (req, res) => {
  try {
    let user = new User({
      uname: req.body.uname,
      email: req.body.email,
      password: req.body.password,
    });
    user = await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// update a user
router.patch("/user/:id", async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const user = await User.findByIdAndUpdate(id, updates, { new: true });

    if (user) {
      res.json(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("An error occurred while updating user");
  }
});


// add project to a user
router.patch("/user", async (req, res) => {
  const email = req.query.email;
  try {
    const user = await User.findOne({email});
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const project = await Project.findById(req.body.project);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
  }

  
  if (user.projects.includes(req.body.project)) {
      return res.status(400).json({ message: 'Project already associated with the user' });
  }
    user.projects.push(project);
    await user.save();

    res.status(201).json({
      message: "Project added successfully",
      user: user,
      project: project,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// delete project from a user
router.delete('/user/:userId/project/:projectId', async (req, res) => {
  try {
      const { userId, projectId } = req.params;

      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      const projectIndex = user.projects.indexOf(projectId);

      if (projectIndex === -1) {
          return res.status(404).json({ message: 'Project not associated with the user' });
      }

      user.projects.splice(projectIndex, 1);
      await user.save();

      res.status(200).json({ message: 'Project removed from user successfully', user });
  } catch (error) {
      console.error('Error removing project from user:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});
// delete project from all users
router.delete('/users/project/:projectId', async (req, res) => {
  try {
      const { projectId } = req.params;

      const result = await User.updateMany(
          { projects: projectId },
          { $pull: { projects: projectId } }
      );

      if (result.nModified === 0) {
          return res.status(404).json({ message: 'No users found with the project' });
      }

      res.status(200).json({ message: 'Project removed from all users successfully' });
  } catch (error) {
      console.error('Error removing project from users:', error);
      res.status(500).json({ message: 'Internal server error' });
  }
});


// delete a user
router.delete("/user/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (user) {
      res.json(user); // Send the updated user as JSON response
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("An error occurred while updating user");
  }
});

//add project to user
router.patch("/user/:id", async (req, res) => {
  const { id } = req.params;
  const project = req.body.project;
  try {
    const user = await User.findByIdAndUpdate(id, updates, { new: true });

    if (user) {
      res.json(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).send("An error occurred while updating user");
  }
});

async function getUserbyID(req, res, next) {
  let user;
  try {
    user = await User.findById(req.params.id);
    if (user == null) {
      return res.status(404).json({ message: "Cannot find user." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }

  res.user = user;
  next();
}

async function getUserbyParams(req, res, next) {
  let user;
  const email = req.query.email;
  const uname = req.query.uname;
  const password = req.query.password;

  try {
    if (!email) user = await User.findOne({ uname, password });

    if (!uname) user = await User.findOne({ email, password });

    if (user) {
      res.user = user;
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).send("An error occurred while fetching user");
  }

  next();
}

module.exports = router;
