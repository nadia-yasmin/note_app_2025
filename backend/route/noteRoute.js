const express = require("express");
const routes = express();
const multer = require("multer");
const upload = multer();
const urlnotfound = require("../constants/urlnotfound");
const noteController = require("../controller/noteController");
const authController = require("../controller/authController");

routes.post( "/addnote", upload.none(),(req, res, next) => {noteController.addNote(req, res);});
routes.post( "/signup", upload.none(),(req, res, next) => {authController.signUp(req, res);});
routes.post( "/login", upload.none(),(req, res, next) => {authController.login(req, res);});
routes.post( "/logout", upload.none(),(req, res, next) => {authController.logout(req, res);});
routes.get( "/shownotebytitle",noteController.showNoteByTitle);
routes.post( "/showallnotes", upload.none(),(req, res, next) => {noteController.showAllNotes(req, res);});
routes.put( "/updatenote", upload.none(),(req, res, next) => {noteController.updateNote(req, res);})
routes.use(urlnotfound.notFound);
module.exports = routes;
