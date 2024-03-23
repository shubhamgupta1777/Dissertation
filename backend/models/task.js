const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
  deliverable: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Deliverable",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  deadLine: {
    type: Date,
    required: true,
  },
  priority: {
    type: String,
    enum: ["LOW", "MEDIUM", "HIGH"],
    default: "LOW",
  },
  status: {
    type: String,
    enum: ["ACTIVE", "IN_PROGRESS", "COMPLETE", "CLOSED"],
    default: "ACTIVE",
  },
});

module.exports = mongoose.model("task", taskSchema);
