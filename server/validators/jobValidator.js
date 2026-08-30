import { body } from "express-validator";

export const createJobValidator = [
  // ==========================================
  // TITLE
  // ==========================================

  body("title")
    .trim()
    .notEmpty()
    .withMessage("Job title is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Job title must be between 2 and 100 characters"),

  // ==========================================
  // COMPANY
  // ==========================================

  body("company")
    .trim()
    .notEmpty()
    .withMessage("Company name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Company name must be between 2 and 100 characters"),

  // ==========================================
  // DESCRIPTION
  // ==========================================

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Job description is required")
    .isLength({ min: 20, max: 5000 })
    .withMessage("Description must be between 20 and 5000 characters"),

  // ==========================================
  // SALARY
  // ==========================================

  body("salary")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Salary cannot exceed 100 characters"),

  // ==========================================
  // LOCATION
  // ==========================================

  body("location").trim().notEmpty().withMessage("Location is required"),

  // ==========================================
  // JOB TYPE
  // ==========================================

  body("jobType")
    .notEmpty()
    .withMessage("Job type is required")
    .isIn(["Full Time", "Part Time", "Internship", "Contract", "Remote"])
    .withMessage("Invalid job type"),

  // ==========================================
  // EXPERIENCE
  // ==========================================

  body("experience")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Experience cannot exceed 100 characters"),

  // ==========================================
  // SKILLS
  // ==========================================

  body("skills").optional().isArray().withMessage("Skills must be an array"),

  body("skills.*")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Skill cannot be empty"),
];
