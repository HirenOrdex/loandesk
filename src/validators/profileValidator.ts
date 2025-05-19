import Joi from "joi";

export const profileUpdateSchema = Joi.object({
  personData: Joi.object({
    firstName: Joi.string().min(1).max(50).optional(),
    middleInitial: Joi.string().min(1).max(50).optional(),
    lastName: Joi.string().min(1).max(50).optional(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    workPhone: Joi.string()
      .pattern(/^[0-9+\-\s()]*$/)
      .max(20)
      .optional()
      .allow(null, ""),
    email2: Joi.string().email().optional().allow(null, ""),
    webUrl: Joi.string().uri().optional().allow(null, ""),
    suiteNo: Joi.string().optional().allow(null, ""),
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
