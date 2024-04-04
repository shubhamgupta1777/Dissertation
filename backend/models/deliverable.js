const mongoose = require("mongoose");

const deliverableSchema = mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "project",
    required: true,
  },
  objective: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "objective",
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
    enum: ["ACTIVE", "IN_PROGRESS", "COMPLETE", "OVERDUE"],
    default: "ACTIVE",
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  dueDays: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("deliverable", deliverableSchema);
