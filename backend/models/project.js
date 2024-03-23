const mongoose = require("mongoose");

const projectSchema = mongoose.Schema({
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
  status: {
    type: String,
    enum: ["ACTIVE", "IN_PROGRESS", "COMPLETE", "OVERDUE"],
    default: "ACTIVE",
  },
});

module.exports = mongoose.model("project", projectSchema);
