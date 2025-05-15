import Joi from "joi";
import { Request, Response, NextFunction } from "express";
import { logger } from "../configs/winstonConfig";
// Joi schema matching the BankerRegistration model
const bankerRegistrationSchema = Joi.object({
  financialInstitutionName: Joi.string().min(2).required().messages({
    "string.empty": "Financial institution name is required.",
    "string.min": "Institution name must be at least 2 characters.",
  }),
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    "string.empty": "Email is required.",
    "string.email": "Email must be a valid email address.",
  }),
  password: Joi.string()
    .min(8)
    .pattern(/[A-Z]/)
    .pattern(/[a-z]/)
    .pattern(/[0-9]/)
    .pattern(/[^A-Za-z0-9]/)
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters.",
      "string.pattern.base": "Password must contain uppercase, lowercase, number, and special character.",
      "string.empty": "Password is required.",
    }),
  firstName: Joi.string().min(2).required().messages({
    "string.empty": "First name is required.",
    "string.min": "First name must be at least 2 characters.",
  }),
  middleInitial: Joi.string().optional().messages({
    "string.length": "Middle initial must be a string.",
  }),
  lastName: Joi.string().min(2).required().messages({
    "string.empty": "Last name is required.",
    "string.min": "Last name must be at least 2 characters.",
  }),
  phone: Joi.string().pattern(/^\+?\d{10,15}$/).required().messages({
    "string.pattern.base": "Phone must be a valid number (10–15 digits).",
    "string.empty": "Phone number is required.",
  }),
  title: Joi.string().required().messages({
    "string.empty": "Title is required.",
  }),
  areaOfSpecialty: Joi.string().required().messages({
    "string.empty": "Area of specialty is required.",
  }),
  address: Joi.string().min(5).required().messages({
    "string.empty": "Address is required.",
    "string.min": "Address must be at least 5 characters.",
  }),
  bankType: Joi.string().required().messages({
    "string.empty": "Bank type is required.",
  }),
  assetSize: Joi.string().required().messages({
    "string.empty": "Asset size is required.",
  }),
});

// Middleware for validating banker registration
export const validateBankerRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payload = req.body;

    const { error } = bankerRegistrationSchema.validate(payload, {
      abortEarly: false,
    });

    logger.info("bankerRegistration validation error", error);

    if (error) {
      res.status(422).json({
        message: "Validation error.",
        errors: error.details.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
      return;
    }

    next();
  } catch (err: any) {
    logger.error("Error in bankerRegistration validation", err);
    res.status(500).json({ success: false, data: [], error: err.message });
  }
};
