const express = require("express");
const routes = express();
const multer = require("multer");
const upload = multer();
const urlnotfound = require("../constants/urlnotfound");
const noteController = require("../controller/noteController");
const authController = require("../controller/authController");

routes.post( "/addnote", upload.none(),(req, res, next) => {noteController.addNote(req, res);});
routes.use(urlnotfound.notFound);
module.exports = routes;
