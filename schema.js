const Joi = require("joi");

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required().messages({
            "string.empty": "Title is required"
        }),

        description: Joi.string().required().messages({
            "string.empty": "Description is required"
        }),

        image: Joi.object({
            url: Joi.string().uri().allow("", null).optional()
        }),

        price: Joi.number().min(0).required().messages({
            "number.base": "Price must be a number",
            "number.min": "Price cannot be negative"
        }),

        location: Joi.string().required().messages({
            "string.empty": "Location is required"
        }),

        country: Joi.string().required().messages({
            "string.empty": "Country is required"
        })
    }).required()
});