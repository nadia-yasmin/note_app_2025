const { success, failure } = require("../constants/common.js");
const noteModel = require("../model/note.js");
const authModel = require("../model/auth.js")
const userModel= require("../model/user.js")
const { promisify } = require("util");
const { validationResult } = require("express-validator");
const {validator}= require("../middleware/noteValidation.js")
const ejs = require("ejs");
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require("dotenv").config();
class noteController {
  async addNote(req, res) {
    try {
      const { title, content, author, email} = req.body;
      const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(failure("Validation failed", errors.array()));
        }
      console.log("title, content, author",title, content, author, email)
      const existingNote = await noteModel.findOne({ title: title });
      if (existingNote) {
        return res.status(400).send(failure("This note already exists"));
      }
       const user = await userModel.findOne({ email: email });
        if (!user) {
            return res.status(404).send(failure("User not found"));
        }
      const result = await noteModel.create({
        title: title,
        author: author,
        content: content,
        email: email,
      });
      if (result) {
         if (!result.noteId.includes(user._id)) {
                result.noteId.push(user._id); 
                await result.save(); 
            }
          return res.status(200).send(success("New note added", result));
        } 
      else {
        return res.status(400).send(failure("Could not add a new note"));
      }
    } catch (error) {
      console.log("Note add error", error);
      return res.status(500).send(failure("Internal server error"));
    }
  } 

  async updateNote(req, res) {
    try {

        const { email, title, newContent } = req.body;
        // console.log("email, title, newContent", email, title, newContent)
const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(failure("Validation failed", errors.array()));
        }
        const prev_note = await noteModel.findOne({ email: email, title: title });
        
        if (!prev_note) {
            return res.status(404).send(failure("Note not found"));
        }

        const user = await authModel.findOne({ email: email });
        if (!user) {
            return res.status(404).send(failure("User not found"));
        }
        if (prev_note.email !== email && user.role !== "admin") {
            return res.status(403).send(failure("Updating is not possible. Only the note owner or an admin can delete it."));
        }
        const note = await noteModel.findOneAndUpdate(
  { email: email, title: title },
  { content: newContent },
  { new: true }
);

if (!note) {
  return res.status(404).send(failure("Note not found"));
}

// Check if note is updated
console.log("Note updated:", note);

const updatedNotes = await noteModel.find({ email: email });
// console.log("Updated notes:", updatedNotes);  // Check if updated notes are fetched

const io = req.app.get("socketio");
if (io) {
 console.log("Broadcasting updated notes to all clients");
  io.emit("noteUpdated", updatedNotes);  // Broadcast to all clients
} else {
  console.error("Socket.io instance not found.");
}


        return res.status(200).send(success("Note updated successfully", note));
    } catch (error) {
        console.error("Error updating note:", error);
        return res.status(500).send(failure("Internal server error"));
    }
}

  
  
  
  async showAllNotes(req, res) {
    try {
        const { email } = req.body;
        console.log("Fetching notes for:", email);

        const allNotes = await noteModel.find({ email: email });
        if (allNotes.length === 0) {
            return res.status(404).send(failure("No notes found"));
        }

      
        return res.status(200).send(success("Notes retrieved successfully", allNotes));
    } catch (error) {
        console.error("Error fetching notes:", error);
        return res.status(500).send(failure("Internal server error"));
    }
}


async showNoteByTitle(req, res) {
  try {
      const { title } = req.query;

      const allNotes = await noteModel.find({ title: title });
      if (allNotes.length === 0) {
          return res.status(404).send(failure("No notes found"));
      }
      return res.status(200).send(success("Notes retrieved successfully", allNotes));
  } catch (error) {
      console.error("Error fetching notes:", error);
      return res.status(500).send(failure("Internal server error"));
  }
}

async deleteNote(req, res) {
    try {
        const { email, title } = req.body;
        const note = await noteModel.findOne({ email: email, title: title });        
        if (!note) {
            return res.status(404).send(failure("Note not found"));
        }
        const user = await authModel.findOne({ email: email });
        if (!user) {
            return res.status(404).send(failure("User not found"));
        }
        if (note.email !== email && user.role !== "admin") {
            return res.status(403).send(failure("Deleting is not possible. Only the note owner or an admin can delete it."));
        }
        const deletedNote = await noteModel.findOneAndDelete({ email: email, title: title });
        if (!deletedNote) {
            return res.status(400).send(failure("Failed to delete the note"));
        }
        return res.status(200).send(success("Note deleted successfully", deletedNote));
    } catch (error) {
        console.error("Error deleting note:", error);
        return res.status(500).send(failure("Internal server error"));
    }
}

async addEditors(req, res) {
    try {
        const { email, title, editorEmail } = req.body; 
        const note = await noteModel.findOne({ email: email, title: title });
        if (!note) {
            return res.status(404).send(failure("Note not found"));
        }
        const user = await authModel.findOne({ email: email });
        if (!user) {
            return res.status(404).send(failure("User not found"));
        }
        if (note.email !== email && user.role !== "admin") {
            return res.status(403).send(failure("Only the note owner or an admin can add editors"));
        }
        const editor = await authModel.findOne({ email: editorEmail });
        if (!editor) {
            return res.status(404).send(failure("Editor user not found"));
        }
        if (note.noteId.includes(editor._id)) {
            return res.status(400).send(failure("This user is already an editor for this note"));
        }
        note.noteId.push(editor._id);
        await note.save(); 
        return res.status(200).send(success("Editor added successfully", note));
    } catch (error) {
        console.error("Error adding editor:", error);
        return res.status(500).send(failure("Internal server error"));
    }
}


  
  
}
module.exports = new noteController();
