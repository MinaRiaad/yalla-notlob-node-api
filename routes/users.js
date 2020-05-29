const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { User, validate } = require("../models/user");
const auth = require("../middlewares/auth");
const preRemoveUser=require('../middlewares/preRemoveUser');
const { upload, deleteImage } = require("../utils/storage");

router.post("/", upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).send("please upload an image");
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("this email already registered");

  user = new User({ ...req.body, imageUrl: req.file.filename });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  user = await user.save();
  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .header("access-control-expose-headers", "x-auth-token")
    .json(_.pick(user, ["_id", "name", "email", "imageUrl"]));
});

router.delete("/", [auth,preRemoveUser], async (req, res) => {
  const user = await User.findOneAndRemove(req.user._id).select(
    "-password -__v"
  );
  if (!user)
    return res.status(400).send("the account with given ID already deleted!");
  deleteImage(user.imageUrl);
  res.send(user);
});

module.exports = router;
