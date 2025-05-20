import { NextFunction } from "express";
import Joi from "joi";
import { logger } from "../configs/winstonConfig";

export const profileUpdateSchema = Joi.object({
  personData: Joi.object({
    firstName: Joi.string().min(1).max(50).optional(),
    middleInitial: Joi.string().optional().allow(null,""),
    lastName: Joi.string().min(1).max(50).optional(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    workPhone: Joi.string()
      .optional()
      .allow(null, ""),
    email2: Joi.string().email().optional().allow(null, ""),
    webUrl: Joi.string().uri().optional().allow(null, ""),
    suiteNo: Joi.string().optional().allow(null, ""),
    linkedinUrl: Joi.string().messages({
        "string": "linkedinUrl must be a String",
      }),

   address: Joi.array()
       .items(
         Joi.object({
           address1: Joi.string().allow(null, ""),
           address2: Joi.string().allow(null, ""),
           city: Joi.string().allow(null, ""),
           state: Joi.string().allow(null, ""),
           zip: Joi.string().allow(null, ""),
           country: Joi.string().allow(null, ""),
           longitude: Joi.string().allow(null, ""),
           latitude: Joi.string().allow(null, ""),
           fullAddress: Joi.string().allow(null, ""),
           suiteNo: Joi.string().allow(null, ""),
         })
       ),
  }).required(),
   profileImage: Joi.any().optional(),
}).unknown(false);
export const validateProfile = (
  req: Request,
  res: any,
  next: NextFunction
) => {

  try {
    const payload = req.body;

    const { error } = profileUpdateSchema.validate(payload, {
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
 