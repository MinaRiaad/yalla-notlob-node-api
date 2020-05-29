const express = require("express");
const router = express.Router();
const { Group, validate } = require("../models/group");
const { User } = require("../models/user");
const auth = require("../middlewares/auth");
const  validateParams= require("../middlewares/validateParams");


router.get("/", [auth], async (req, res) => {
  const groups = await Group.find().populate('members');
  res.send(groups);
});

router.get("/:id", [auth,validateParams], async (req, res) => {
    const {friends}=await User.findById(req.user._id).populate('friends');
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(400).send("group of given id is not found");
    res.send({group,friends});
});


router.post("/", [auth], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.send(error.details[0].message);

  const group = new Group({
    owner: req.user._id,
    name: req.user.name,
  });
  await group.save();

  res.send(group);
});

router.post("/:groupId/member/:memberId", [auth,validateParams], async (req, res) => {
  const group = await Group.findById(req.params.groupId);
  if (!group) return res.status(400).send("group of given id is not found");
  const memberIndex = group.members.indexOf(req.params.memberId);
  if (memberIndex !== -1)
    return res
      .status(400)
      .send("member of given id is already found in the group");
  const user = await User.findById(req.params.memberId);
  if (!user) return res.status(400).send("member of given id is not found");
  group.members.push(req.params.memberId);
  await group.save();
  res.send(group);
});

router.delete("/:id", [auth,validateParams], async (req, res) => {
  const group = await Group.findByIdAndRemove(req.params.id);
  if (!group) return res.status(400).send("group of given id is not found");
  res.send(group);
});

router.delete("/:groupId/member/:memberId", [auth,validateParams], async (req, res) => {
  let group = await Group.findById(req.params.groupId);
  if (!group) return res.status(400).send("group of given id is not found");

  const memberIndex = group.members.indexOf(req.params.memberId);
  if (memberIndex === -1)
    return res.status(400).send("member of given id is not found");

  group.members.splice(memberIndex - 1, 1);
  await group.save();
  res.send(group);
});

module.exports = router;
