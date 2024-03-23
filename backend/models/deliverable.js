const mongoose = require("mongoose");

const deliverableSchema = mongoose.Schema({
  objective: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Objective",
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
    enum: ["ACTIVE", "IN_PROGRESS", "COMPLETE", "OVERDUE"],
    default: "ACTIVE",
  },
});

module.exports = mongoose.model("deliverable", deliverableSchema);
