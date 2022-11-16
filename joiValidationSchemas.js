const joi = require("joi")

const campSchema = joi.object(
    {
        camp: joi.object({
            title: joi.string().required(),
            price: joi.number().required().min(0),
            description: joi.string().required(),
            location: joi.string().required(),
            //image: joi.string().required()
        }).required(),
        deleteImages: joi.array()
    }
)

const reviewSchema = joi.object(
    {
        review: joi.object({
            body: joi.string().required(),
            rating: joi.number().required()
        }).required()
    }
)

module.exports.campSchema = campSchema
module.exports.reviewSchema = reviewSchema