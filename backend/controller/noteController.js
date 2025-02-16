const { success, failure } = require("../constants/common.js");
const noteModel = require("../model/note");
const { promisify } = require("util");
const ejs = require("ejs");
const express = require("express");
const app = express();
const { validationResult } = require("express-validator");
const {io}= require("../index.js")
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require("dotenv").config();
class noteController {
  async addNote(req, res) {
    try {
      const { title, content, author, email} = req.body;
      console.log("title, content, author",title, content, author, email)
      const existingNote = await noteModel.findOne({ title: title });
      if (existingNote) {
        return res.status(400).send(failure("This note already exists"));
      }
      const result = await noteModel.create({
        title: title,
        author: author,
        content: content,
        email: email,
      });
      if (result) {
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
      const { title, content } = req.body;
      const note = await noteModel.findOne({ title }); 
      if (!note) {
        return res.status(404).json({ error: "Note not found" });
      } 
      note.content = content;
      const savedNote = await note.save();
      const io = req.app.get("socketio");
      io.emit("noteUpdated", { title, content: savedNote.content });
  
      return res.status(200).json({
        message: "Note updated successfully",
        savedNote,
      });
    } catch (error) {
      console.error("Update note error", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  
  
  async showAllNotes(req, res) {
    try {
        const { email } = req.body;
        console.log("email", email);

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
      console.log("title", title);

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
  
  
}
module.exports = new noteController();
