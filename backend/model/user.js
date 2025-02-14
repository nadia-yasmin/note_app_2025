const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "email must be given"],
    },
    name: {
      type: String,
      required: [true, "name must be given"],
    },
    userblocked: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      required: [true, "role must be given"],
    },
    
  },
  { timestamps: true }
);
const userModel = mongoose.model("users", userSchema);
module.exports = userModel;
