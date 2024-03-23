const express = require("express");
const router = express.Router();
const User = require("../models/user");

// get all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
  const { id } = req.params
  const updates = req.body;
  try {

    const user = await User.findByIdAndUpdate( id, updates, { new: true });

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
