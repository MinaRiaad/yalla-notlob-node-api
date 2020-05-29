const express = require("express");
const router = express.Router();
const { Restaurant, validate } = require("../models/restaurant");
const { upload, deleteImage } = require("../utils/storage");
const auth = require("../middlewares/auth");
const  validateParams= require("../middlewares/validateParams");
const preRemoveRestaurant=require('../middlewares/preRemoveRestaurant');



router.get("/", [auth], async (req, res) => {
  const restaurants = await Restaurant.find();
  res.send(restaurants);
});

router.get("/:id", [auth,validateParams], async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  res.send(restaurant);
});

router.post("/", [auth, upload.single("menu")], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let restaurant = await Restaurant.findOne({ phone: req.body.phone });
  if (restaurant) return res.status(400).send("phone number already exist!");
  restaurant = new Restaurant({ ...req.body, menu: req.file.filename });
  await restaurant.save();
  res.send(restaurant);
});

router.put("/:id", [auth,validateParams], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant)
    return res.status(400).send("the restaurant with given id is not found");
  req.send(restaurant);
});

router.delete("/:id", [auth,validateParams,preRemoveRestaurant], async (req, res) => {
  const restaurant = await Restaurant.findOneAndRemove({ _id: req.params.id });
  if (!restaurant)
    return res.status(400).send("The restaurant with given ID is not found");
  deleteImage(restaurant.menu);
  res.send(restaurant);
});

module.exports = router;
