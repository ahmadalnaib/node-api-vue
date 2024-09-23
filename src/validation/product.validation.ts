import { Joi } from "express-validation";

export const ProductValidation = Joi.object({
 title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required(),
    category: Joi.string().required(),
    rating_rate: Joi.number().required(),
    rating_count: Joi.number().required(),
  
});