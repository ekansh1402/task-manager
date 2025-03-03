const { UNAUTHORIZED } = require("http-status-codes");
const { rolePriority } = require("../constants");
const { ErrorHandler } = require("./errorHandler");
const getRoutePriority = require("../utils/getRoutePriority");
const authorization = async (req, res, next) => {
  const userRole = req.role;
  const userPriority = rolePriority[userRole];
  const maxPriority = await getRoutePriority(req.path);

  if (maxPriority && userPriority <= maxPriority) {
    return next();
  }
  next(new ErrorHandler(UNAUTHORIZED, "DMS-VEO", "user not authorized"));
};
module.exports = authorization;
