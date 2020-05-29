const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);

function validateParams(id) {
  const schema = Joi.objectId().label("Id");
  return schema.validate(id);
}

module.exports = function (req, res, next) {
  const { error } = validateParams(
     req.params.id || req.params.memberId && req.params.groupId
  );
  if (error) return res.status(400).send("invalid ID");
  next();
};
