const mongoose = require("mongoose");

const projectSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: [50, "cannot exceed 50 characters"],
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
  complete: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.model("project", projectSchema);
