const { v4: uuidv4 } = require("uuid");
const morgan = require("morgan");
const logger = require("../utils/logger");
const { routesToGenerateReqId } = require("../constants");
const assign_id = (req, res, next) => {
  if (
    req.path === routesToGenerateReqId.sign_in ||
    req.path === routesToGenerateReqId.sign_up
  )
    req.req_id = uuidv4();
  next();
};
morgan.token("req_id", (req) => req.req_id);

const morganMiddleware = morgan(
  function (tokens, req, res) {
    const message = {
      path: tokens.url(req, res),
      req_id: tokens.req_id(req, res),
      response: {
        status: tokens.status(req, res),
        length: tokens.res(req, res, "content-length"),
        response_time: tokens["response-time"](req, res),
      },
    };
    return JSON.stringify(message);
  },
  {
    stream: {
      write: (message) => {
        const logMessage = JSON.parse(message);
        logger.http(logMessage);
      },
    },
  }
);

module.exports = { assign_id, morganMiddleware };
