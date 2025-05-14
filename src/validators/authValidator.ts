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
// Common fields
const baseUserSchema = {
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  confirm_password: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Passwords do not match",
    }),
  firstName: Joi.string().required(),
  middleInitial: Joi.string().max(1).optional().allow(""),
  lastName: Joi.string().required(),
  phone: Joi.string().required(),
};

// Banker schema
export const bankerSchema = Joi.object({
  ...baseUserSchema,
  financialInstitutionName: Joi.string().required(),
  title: Joi.string().required(),
  areaOfSpecialty: Joi.string().required(),
  bankType: Joi.string().required(),
  assetSize: Joi.string().required(),
  address: Joi.array()
    .items(
      Joi.object({
        address1: Joi.string().allow(null, ""),
        address2: Joi.string().allow(null, ""),
        city: Joi.string().required(),
        state: Joi.string().required(),
        zip: Joi.string().allow(null, ""),
        country: Joi.string().required(),
        longitude: Joi.string().required(),
        latitude: Joi.string().required(),
        fulladdress: Joi.string().required(),
        suiteno: Joi.string().allow(null, ""),
      })
    )
    .required(),
});

// Borrower schema
export const borrowerSchema = Joi.object({
  ...baseUserSchema,
  position: Joi.string().required(),
  other_position: Joi.alternatives()
  .conditional('position', {
    is: 'other',
    then: Joi.string().required().label('Other Position'),
    otherwise: Joi.string().allow(null,'').optional(),
  }),
  captchaCode: Joi.string(),
  coname: Joi.string().required(),
});

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

export const validateRegister = (
  req: Request,
  res: any,
  next: NextFunction
) => {
  const type = req.query.type;

  let schema;

  if (type === "banker") {
    schema = bankerSchema;
  } else if (type === "borrower") {
    schema = borrowerSchema;
  } else {
    return res
      .status(400)
      .json({ message: "Invalid or missing user type in query param" });
  }

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      message: "Validation failed",
      details: error.details.map((detail) => detail.message),
    });
  }

  next();
};
