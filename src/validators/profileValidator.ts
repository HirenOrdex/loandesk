import Joi from "joi";

export const profileUpdateSchema = Joi.object({
  firstName: Joi.string().min(1).max(50).optional(),
  lastName: Joi.string().min(1).max(50).optional(),
   email: Joi.string().email().required(),
    phone: Joi.string().required(),
  workPhone: Joi.string()
    .pattern(/^[0-9+\-\s()]*$/)
    .max(20)
    .optional()
    .allow(null, ""),
  email2: Joi.string().email().optional().allow(null, ""),
  webURL: Joi.string().uri().optional().allow(null, ""),
  linkedinUrl: Joi.string()
    .uri()
    .optional()
    .allow(null, "")
    .messages({
      "string.uri": "linkedinUrl must be a valid URL",
    }),
  addressId: Joi.string()
    .hex()
    .length(24)
    .optional()
    .allow(null, "")
    .messages({
      "string.length": "addressId must be a 24 character hex string",
    }),
});
