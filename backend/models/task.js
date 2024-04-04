const mongoose = require("mongoose");

const taskSchema = mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "project",
    required: true,
  },
  deliverable: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "deliverable",
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  name: {
    type: String,
    required: true,
    maxlength: [50, 'cannot exceed 50 characters']
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
    enum: ["ACTIVE", "IN_PROGRESS", "COMPLETE", "CLOSED", "OVERDUE"],
    default: "ACTIVE",
  },
  dueDays: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("task", taskSchema);
