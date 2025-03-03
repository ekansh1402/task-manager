const Joi = require("joi");
const { mobileValidator } = require("../constants");

const userSchema = Joi.object({
  fullname: Joi.string().min(3).max(30).required(),
  email: Joi.string().required(),
  address: Joi.string().min(3).max(50).required(),
  mobile: Joi.string().regex(mobileValidator).required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("user", "manager", "admin").required(),
});

const authSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().required(),
});
module.exports = { userSchema, authSchema };
