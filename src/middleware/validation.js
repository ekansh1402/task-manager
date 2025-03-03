const { BAD_REQUEST } = require("http-status-codes");
const logger = require("../utils/logger");
const { ErrorHandler } = require("./errorHandler");

function validateRequest(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(
      { ...req.body, ...req.params },
      { abortEarly: false }
    );
    if (error) {
      throw new ErrorHandler(
        BAD_REQUEST,
        "DMA-VEO",
        error.details.map((detail) => detail.message).join(", ")
      );
    }
    next();
  };
}

module.exports = validateRequest;
