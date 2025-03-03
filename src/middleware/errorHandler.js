const { INTERNAL_SERVER_ERROR } = require("http-status-codes");
const logger = require("../utils/logger");
const router = require("express").Router();

const errorRoute = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const result = err.result || {
    data: null,
    error: { errorCode: "DMS-VEO", errorMessage: "internal error" },
  };
  logger.error({
    path: req.originalUrl,
    req_id: req.req_id,
    response: result,
  });

  return res.status(status).json(result);
};

class ErrorHandler extends Error {
  constructor(
    statusCode = INTERNAL_SERVER_ERROR,
    errorCode = "UNKNOWN_ERROR",
    errorMessage = "Something went wrong",
    stack
  ) {
    super(errorMessage);
    this.statusCode = statusCode;
    this.result = {
      data: null,
      error: {
        errorCode,
        errorMessage,
      },
    };
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

module.exports = { errorRoute, ErrorHandler };
