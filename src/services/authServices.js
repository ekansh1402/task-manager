const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const user = require("../models/user");
const response = require("../utils/response");

async function signupServices(data) {
  await user.isUserAlreadyExist(data.username);

  const hashed_password = await bcrypt.hash(data.password, 10);
  data.password = hashed_password;
  const res = await user.signUp(data);

  return response(res.status, res.message);
}

async function signinServices(data) {
  const { username, password, req_id } = data;

  const res = await user.signIn(username, password);
  const authToken = jwt.sign(
    { user_id: res.data.user_id, req_id: req_id, role: res.data.role },
    process.env.JWT_SECRET
  );

  return response(res.status, res.message, { authToken });
}

module.exports = {
  signupServices,
  signinServices,
};
