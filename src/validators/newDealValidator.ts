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
  website: Joi.string().optional().allow(null, ""),
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
export const createGuarantorsSchema = Joi.object({
  guarantors: Joi.array()
    .items(
      Joi.object({
        person: Joi.object({
          firstName: Joi.string().required(),
          middleInitial: Joi.string().optional().allow(""),
          lastName: Joi.string().required(),
          email2: Joi.string().email().required(),
          workPhone: Joi.string().optional().allow(null, ""),
          address: Joi.object({
            address1: Joi.string().allow(null, ""),
            address2: Joi.string().allow(null, ""),
            city: Joi.string().required(),
            state: Joi.string().required(),
            zip: Joi.string().allow(null, ""),
            country: Joi.string().required(),
            longitude: Joi.string().optional(),
            latitude: Joi.string().optional(),
            fullAddress: Joi.string().required(),
            suiteNo: Joi.string().allow(null, ""),
          }).optional(),
        }).required(),
        isGuarantor: Joi.boolean().required(),
        percentageOfOwnership: Joi.number().min(0).max(100).required(),
        numberOfCOI: Joi.number().integer().min(0).required(),
        active: Joi.boolean().required(),
      })
    )
    .min(1)
    .required(),
});

export const updateGuarantorSchema = Joi.object({
  guarantors: Joi.array()
    .items(
      Joi.object({
        guarantorId: Joi.string()
          .regex(/^[0-9a-fA-F]{24}$/)
          .required(), // Mongo ObjectId string validation
        person: Joi.object({
          firstName: Joi.string().required(),
          middleInitial: Joi.string().optional().allow(""),
          lastName: Joi.string().required(), email2: Joi.string().email().optional(),
          workPhone: Joi.string().optional().allow(null, ""),
        }).optional(),
        isGuarantor: Joi.boolean().optional(),
        percentageOfOwnership: Joi.number().min(0).max(100).optional(),
        numberOfCOI: Joi.number().integer().min(0).optional(),
        active: Joi.boolean().optional(),
      })
    )
    .min(1)
    .required(),
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
export const guarantorCreateValidations = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payload = req.body;

    console.log("Guarantor Create Step2 Payload:", payload);

    const { error } = createGuarantorsSchema.validate(payload, {
      abortEarly: false,
    });

    if (error) {
      console.error("Guarantor Create Step2 Validation Error:", error.details);
      logger?.error?.(
        "Guarantor Create Step2 Validation Error:",
        error.details
      );

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
    console.error("Error in Guarantor Create Step2 validation:", err);
    logger?.error?.("Error in Guarantor Create Step2 validation:", err);

    res.status(500).json({
      success: false,
      data: null,
      message: "An error occurred during validation.",
      error: err.message,
    });
  }
};
export const guarantorUpdateValidations = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payload = req.body;

    console.log("Guarantor Update Step2 Payload:", payload);

    const { error } = updateGuarantorSchema.validate(payload, {
      abortEarly: false,
    });

    if (error) {
      console.error("Guarantor Update Step2 Validation Error:", error.details);
      logger?.error?.(
        "Guarantor Update Step2 Validation Error:",
        error.details
      );

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
    console.error("Error in Guarantor Update Step2 validation:", err);
    logger?.error?.("Error in Guarantor Update Step2 validation:", err);

    res.status(500).json({
      success: false,
      data: null,
      message: "An error occurred during validation.",
      error: err.message,
    });
  }
};