import Joi from "joi";
import { logger } from "../configs/winstonConfig";
import { Request, Response, NextFunction } from "express";

export const borrowerCompanySchema = Joi.object({
  companyName: Joi.string().required().messages({
    "any.required": `"companyName" is required`,
    "string.empty": `"companyName" cannot be empty`,
  }),
  legalEntity: Joi.string().required().messages({
    "any.required": `"legalEntity" is required`,
    "string.empty": `"legalEntity" cannot be empty`,
  }),
  businessPhone: Joi.string().required().messages({
    "any.required": `"businessPhone" is required`,
    "string.empty": `"businessPhone" cannot be empty`,
  }),
  website: Joi.string().uri().optional().allow(null, ""),
  suite: Joi.string().optional().allow(null, ""),
  address: Joi.array()
    .items(
      Joi.object({
        address1: Joi.string().allow(null, ""),
        address2: Joi.string().allow(null, ""),
        city: Joi.string().required().messages({
          "any.required": `"city" is required in address`,
        }),
        state: Joi.string().required().messages({
          "any.required": `"state" is required in address`,
        }),
        zip: Joi.string().allow(null, ""),
        country: Joi.string().required().messages({
          "any.required": `"country" is required in address`,
        }),
        longitude: Joi.string().required().messages({
          "any.required": `"longitude" is required in address`,
        }),
        latitude: Joi.string().required().messages({
          "any.required": `"latitude" is required in address`,
        }),
        fullAddress: Joi.string().required().messages({
          "any.required": `"fulladdress" is required in address`,
        }),
        suiteNo: Joi.string().allow(null, ""),
      })
    )
    .required()
    .messages({
      "any.required": `"address" must be provided as an array`,
    }),
});

export const BorrowerCompanyValidations = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payload = req.body;

    console.log("Borrower Company Payload:", payload);

    const { error } = borrowerCompanySchema.validate(payload, { abortEarly: false });

    if (error) {
      console.error("Borrower Company Validation Error:", error.details);
      logger?.error?.("Borrower Company Validation Error:", error.details);

      res.status(422).json({
        success: false,
        message: "Validation error",
        errors: error.details.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        })),
      });
      return;
    }

    next(); // Proceed to next middleware/controller
  } catch (err: any) {
    console.error("Error in Borrower Company validation:", err);
    logger?.error?.("Error in Borrower Company validation:", err);

    res.status(500).json({
      success: false,
      data: null,
      message: "An error occurred during validation.",
      error: err.message,
    });
  }
};