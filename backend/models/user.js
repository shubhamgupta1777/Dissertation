const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  uname: {
    type: String,
    required: true,
    maxlength: [20, 'cannot exceed 20 characters']
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  },
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'project'
}]
});

module.exports = mongoose.model("user", userSchema);
