const { OK } = require("http-status-codes");
const { signinServices, signupServices } = require("../services/authServices");
const logger = require("../utils/logger");

async function signup(req, res) {
  const req_id = req.req_id;
  try {
    const data = req.body;
    const response = await signupServices(data);
    logger.info({
      path: req.originalUrl,
      req_id: req_id,
      response: response,
    });
    return res.status(response.statusCode).json(response);
  } catch (err) {
    logger.error({
      path: req.originalUrl,
      req_id: req_id,
      response: err.result,
    });
    return res.status(err.statusCode).json(err.result);
  }
}

async function signin(req, res) {
  const req_id = req.req_id;
  try {
    const data = req.body;
    const response = await signinServices({ ...data, req_id: req_id });
    res.cookie("authToken", response.data.authToken, {
      httpOnly: true,
    });
    logger.info({
      path: req.originalUrl,
      req_id: req_id,
      response: response,
    });
    return res.status(response.statusCode).json(response);
  } catch (err) {
    logger.error({
      path: req.originalUrl,
      req_id: req_id,
      response: err.result,
    });
    return res.status(err.statusCode).json(err.result);
  }
}

module.exports = { signup, signin };
