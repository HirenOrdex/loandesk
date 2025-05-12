// src/validators/authValidator.ts
import Joi from "joi";
import { Request, Response, NextFunction, RequestHandler } from "express";

// Define auth schemas
const authSchemas = {
  register: Joi.object({
    firstName: Joi.string().min(2).required().messages({
      "string.min": "firstName must be at least 2 characters",
      "any.required": "firstName is required",
    }),
    lastName: Joi.string().min(2).required().messages({
      "string.min": "lastName must be at least 2 characters",
      "any.required": "lastName is required",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Invalid email address",
      "any.required": "Email is required",
    }),
    password: Joi.string()
      .min(8)
      .pattern(/[A-Z]/)
      .pattern(/[a-z]/)
      .pattern(/[0-9]/)
      .pattern(/[^A-Za-z0-9]/)
      .required()
      .messages({
        "string.min": "Password must be at least 8 characters",
        "string.pattern.base":
          "Password must contain at least one uppercase letter, lowercase letter, number, and special character",
        "any.required": "Password is required",
      }),
  }),

  login: Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Invalid email address",
      "any.required": "Email is required",
    }),
    password: Joi.string().required().messages({
      "any.required": "Password is required",
    }),
  }),

  forgotPassword: Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Invalid email address",
      "any.required": "Email is required",
    }),
  }),

  resetPassword: Joi.object({
    token: Joi.string().required().messages({
      "any.required": "Reset token is required",
    }),
    password: Joi.string()
      .min(8)
      .pattern(/[A-Z]/)
      .pattern(/[a-z]/)
      .pattern(/[0-9]/)
      .pattern(/[^A-Za-z0-9]/)
      .required()
      .messages({
        "string.min": "Password must be at least 8 characters",
        "string.pattern.base":
          "Password must contain at least one uppercase letter, lowercase letter, number, and special character",
        "any.required": "Password is required",
      }),
  }),
  changePassword: Joi.object({
    oldPassword: Joi.string().required().messages({
      "any.required": "Old Password is required",
    }),
    newPassword: Joi.string().required().messages({
      "any.required": "New Password is required",
    }),
  }),
};

// Validator middleware
export const validateRequest = (
  schemaName: keyof typeof authSchemas
): RequestHandler => {
  return (req, res, next) => {
    const schema = authSchemas[schemaName];
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errorMessage = error.details[0].message;
      res.status(400).json({
        status: "error",
        message: errorMessage,
      });
      return;
    }

    next();
  };
};
