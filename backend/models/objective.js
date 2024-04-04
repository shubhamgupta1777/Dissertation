const mongoose = require("mongoose");

const objectiveSchema = mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "project",
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
  priority: {
    type: String,
    enum: ["LOW", "MEDIUM", "HIGH"],
    default: "LOW",
  },
});

module.exports = mongoose.model("objective", objectiveSchema);
