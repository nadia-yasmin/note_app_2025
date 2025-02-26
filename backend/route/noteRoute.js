const express = require("express");
const routes = express();
const multer = require("multer");
const upload = multer();
const urlnotfound = require("../constants/urlnotfound");
const noteController = require("../controller/noteController");
const authController = require("../controller/authController");
const {
    isAuthorised,
    isAdmin,
    isUser, 
  } = require("../middleware/authentictevalidation");
const {validator,} = require("../middleware/noteValidation")
routes.post( "/addnote", isAuthorised, validator.noteCreate,(req, res) => {noteController.addNote(req, res);});
routes.post( "/signup", isAuthorised,upload.none(),(req, res, next) => {authController.signUp(req, res);});
routes.post( "/login", upload.none(),(req, res, next) => {authController.login(req, res);});
routes.post( "/logout",isAuthorised, upload.none(),(req, res, next) => {authController.logout(req, res);});
routes.get( "/shownotebytitle",isAuthorised,noteController.showNoteByTitle);
routes.post( "/showallnotes", isAuthorised,upload.none(),(req, res, next) => {noteController.showAllNotes(req, res);});
routes.put( "/updatenote",isAuthorised, validator.noteUpdate, (req, res, next) => {noteController.updateNote(req, res);})
routes.delete( "/deletenote",isAuthorised, validator.noteDelete, (req, res, next) => {noteController.deleteNote(req, res);})
routes.put( "/addeditors",isAuthorised, (req, res, next) => {noteController.addEditors(req, res);})
routes.use(urlnotfound.notFound);
module.exports = routes;
