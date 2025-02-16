const mongoose = require("mongoose");
const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title must be given"],
    },
    content: {
      type: String,
      required: [true, "content must be given"],
    },
    author: {
        type: String,
        required: [true, "author must be given"],
      }, 
      email: {
        type: String,
        required: [true, "email must be given"],
      }, 
      noteId: 
        [
          {type: String,},
        ],
         
  },
  { timestamps: true }
);
const noteModel = mongoose.model("notes", noteSchema);

module.exports = noteModel;
