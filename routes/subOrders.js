const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { SubOrder, validate } = require("../models/subOrder");
const { Order } = require("../models/order");
const auth = require("../middlewares/auth");
const  validateParams= require("../middlewares/validateParams");


//may be need that route in the future
// router.get("/", [auth], async (req, res) => {
//   const subOrders = await SubOrder.find()
//     .populate("owner", ["name"])
//     .sort("created_at");
//   res.send(subOrders);
// });

router.post("/:id", [auth,validateParams], async (req, res) => {
  const { error } = validate({...req.body,order:req.params.id});
  if (error) return res.send(error.details[0].message);

  const order = await Order.findById(req.params.id);
  if (!order)
    return res.status(400).send("the order of provided id is not found");

  const subOrder = new SubOrder({
    owner: req.user._id,
    order:req.params.id,
    ..._.pick(req.body,['amount','item','price','comment'])
  });
  await subOrder.save();
  order.subOrders.push(subOrder._id);
  order.save();
  res.send(order);
});

// router.put("/:id", [auth,validateParams], async (req, res) => {
//   const { error } = validate({...req.body,order:req.params.id});
//   if (error) return res.send(error.details[0].message);

//   const subOrder = await SubOrder.findOneAndUpdate(
//     { _id: req.params.id },
//     req.body
//   );
//   if (!subOrder)
//     return res.status(400).send("The sub_order with given ID is not found");
//   res.send(subOrder);
// });

router.delete("/:id", [auth,validateParams], async (req, res) => {
  const subOrder = await SubOrder.findOneAndRemove({ _id: req.params.id });
  if (!subOrder)
    return res.status(400).send("The order with given ID is not found");
  res.send(subOrder);
});

module.exports = router;
