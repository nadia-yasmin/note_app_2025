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
          return res.status(200).send(success("New course added", result));
        } 
      else {
        return res.status(400).send(failure("Could not add a new course"));
      }
    } catch (error) {
      console.log("Course add error", error);
      return res.status(500).send(failure("Internal server error"));
    }
  } 
}
module.exports = new noteController();
