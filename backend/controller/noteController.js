const { success, failure } = require("../constants/common.js");
const noteModel = require("../model/note");
const { promisify } = require("util");
const ejs = require("ejs");
const express = require("express");
const app = express();
const { validationResult } = require("express-validator");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require("dotenv").config();
class noteController {
  async addNote(req, res) {
    try {
      const { title, content, author} = req.body;
      console.log("title, content, author",title, content, author)
      const existingNote = await noteModel.findOne({ title: title });
      if (existingNote) {
        return res.status(400).send(failure("This note already exists"));
      }
      const result = await noteModel.create({
        title: title,
        author: author,
        content: content,
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
      const note = await noteModel.findOne({ title: title });
      if (!note) {
        return res.status(404).json({ error: "Note is not found" });
      }
      note.content = content;
      const savedNote = await note.save();
      return res
        .status(200)
        .json({ message: "Note updated successfully", savedNote });
    } catch (error) {
      console.error("Update note error", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
module.exports = new noteController();
