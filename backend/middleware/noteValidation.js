const { body } = require("express-validator");

const validator = {
  noteCreate: [
    body("title")
      .exists().withMessage("Title must be provided")
      .notEmpty().withMessage("Title cannot be empty")
      .isString().withMessage("Title must be a string")
      .isLength({ min: 5 }).withMessage("Title must be at least 5 characters long")
      .isLength({ max: 100 }).withMessage("Title cannot exceed 100 characters"),
      
    body("content")
      .exists().withMessage("Content must be provided")
      .notEmpty().withMessage("Content cannot be empty")
      .isString().withMessage("Content must be a string")
      .isLength({ min: 20 }).withMessage("Content must be at least 20 characters long")
      .isLength({ max: 1000 }).withMessage("Content cannot exceed 1000 characters"),

    body("author")
      .exists().withMessage("Author must be provided")
      .notEmpty().withMessage("Author cannot be empty")
      .isString().withMessage("Author must be a string")
      .matches(/^[A-Za-z\s]+$/).withMessage("Author name can only contain letters (A-Z, a-z)"),

    body("email")
      .exists().withMessage("Email must be provided")
      .notEmpty().withMessage("Email cannot be empty")
      .isEmail().withMessage("Invalid email format")
  ],

  noteUpdate: [
    body("title")
            .exists().withMessage("Title must be provided")
      .notEmpty().withMessage("Title cannot be empty")
      .isString().withMessage("Title must be a string")
      .isLength({ min: 5 }).withMessage("Title must be at least 5 characters long")
      .isLength({ max: 100 }).withMessage("Title cannot exceed 100 characters"),
      
    body("newContent")
       .exists().withMessage("New content must be provided")
      .notEmpty().withMessage("New content cannot be empty")
      .isString().withMessage("New content must be a string")
      .isLength({ min: 20 }).withMessage("New content must be at least 20 characters long")
      .isLength({ max: 1000 }).withMessage("New content cannot exceed 1000 characters"),

  body("email")
      .exists().withMessage("Email must be provided")
      .notEmpty().withMessage("Email cannot be empty")
      .isEmail().withMessage("Invalid email format"),

]
,
noteDelete: [
    body("title")
      .exists().withMessage("Title must be provided")
      .notEmpty().withMessage("Title cannot be empty")
      .isString().withMessage("Title must be a string")
      .isLength({ min: 5 }).withMessage("Title must be at least 5 characters long")
      .isLength({ max: 100 }).withMessage("Title cannot exceed 100 characters"),
      
   
    body("email")
      .exists().withMessage("Email must be provided")
      .notEmpty().withMessage("Email cannot be empty")
      .isEmail().withMessage("Invalid email format")
  ],

};

module.exports = { validator };
