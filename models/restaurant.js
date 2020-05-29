const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 50,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      maxlength: 11,
      minlength: 11,
      unique: true,
      trim: true,
    },
    menu: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true
  }
);

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

function validateRestaurant(restaurant) {
  const schema = Joi.object({
    name: Joi.string().min(1).max(50).required().trim(),
    phone: Joi.string()
      .min(11)
      .max(11)
      .regex(/^01[0-2-5]{1}[0-9]{8}/)
      .required()
      .error((errors) => {
        errors.map((error) => {
          error.message = "Invalid Phone Number !";
        });
        return errors;
      }),
    menu: Joi.string(),
  });
  return schema.validate(restaurant);
}

module.exports.Restaurant = Restaurant;
module.exports.validate = validateRestaurant;
module.exports.restaurantSchema = restaurantSchema;
