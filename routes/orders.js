const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const { Order, validate } = require("../models/order");
const { Restaurant } = require("../models/restaurant");
const auth = require("../middlewares/auth");
const preRemoveOrder = require("../middlewares/preRemoveOrder");
const validateParams = require("../middlewares/validateParams");

router.get("/", [auth], async (req, res) => {
  const orders = await Order.find()
    .populate("owner joined_users restaurant invited_users", ["name", "menu", "phone"])
    .populate({
      path: "subOrders",
      populate: { path: "owner", select: "name" },
    })
    .sort("created_at");
  res.send(orders);
});

router.get("/addorder", [auth], async (req, res) => {
  const users = await User.find().select("email name");
  const restaurants = await Restaurant.find();
  res.send({ users, restaurants });
});

router.get("/:id", [auth,validateParams], async (req, res) => {
  const orders = await Order.findById(req.params.id)
    .populate("owner joined_users restaurant invited_users", ["name", "menu", "phone"])
    .populate({
      path: "subOrders",
      populate: { path: "owner", select: "name created_at" },
    })
    .sort("created_at");
  res.send(orders);
});

router.post("/", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.send(error.details[0].message);

  const restaurant = await Restaurant.findById(req.body.restaurant);
  if (!restaurant) return res.status(400).send("invalid restaurant");

  const order = new Order({...req.body,owner: req.user._id});
  await order.save();
  res.send(order);
});

router.put("/:id", [auth, validateParams], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.send(error.details[0].message);

  const restaurant = await Restaurant.findById(req.body.restaurant);
  if (!restaurant)
    return res.status(400).send("The restaurant with given ID is not found");

  const order = await Order.findOneAndUpdate({ _id: req.params.id }, req.body);
  if (!order)
    return res.status(400).send("The order with given ID is not found");
  res.send(order);
});

router.delete(
  "/:id",
  [auth, validateParams, preRemoveOrder],
  async (req, res) => {
    const order = await Order.findOneAndRemove({ _id: req.params.id });
    if (!order)
      return res.status(400).send("The order with given ID is not found");
    res.send(order);
  }
);

router.put("/:id/join", [auth,validateParams], async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order)
    return res.status(400).send("the order with provided ID is not found");
  const user = await findById(req.params.memberId);
  if (!user) return res.status(400).send("the user with given ID is not found");
  order.joined_users.push(req.user);
  await order.save();
  res.send(order);
});

router.put("/:id/invite", [auth,validateParams], async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order)
    return res.status(400).send("the order of provided id is not found");
  order.joined_users.push(req.params.id);
  await order.save();
  res.send(order);
});

module.exports = router;
