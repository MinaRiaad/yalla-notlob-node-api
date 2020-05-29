const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
Joi.ObjectId = require("joi-objectid")(Joi);
// add order_id field for sub_order model
const subOrderSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    item: {
      type: String,
      required: true,
      maxlength: 50,
      trim: true,
    },
    amount: {
      type: Number,
      min: 1,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      min: 1,
      required: true,
      trim: true,
    },
    comment: {
      type: String,
      maxlength: 500,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const SubOrder = mongoose.model("SubOrder", subOrderSchema);

function validateSubOrder(order) {
  const schema = Joi.object({
    order: Joi.objectId().required().label("order"),
    item: Joi.string().max(50).required(),
    price: Joi.number().min(1).required(),
    amount: Joi.number().min(1).required(),
    comment: Joi.string().max(500),
  });
  return schema.validate(order);
}

module.exports.SubOrder = SubOrder;
module.exports.validate = validateSubOrder;
