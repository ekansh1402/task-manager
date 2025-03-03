const { redisClient } = require("../config/redis");
const logger = require("../utils/logger");

const cachedData = async (req, res, next) => {
  const user_id = req.user_id;
  const filter = { user_id, ...req.body };
  let paging = {};
  paging.page_no = parseInt(req.query.page) || 1;
  paging.page_size = parseInt(req.query.limit) || 10;
  const cacheResults = await redisClient.get(
    JSON.stringify({ ...filter, ...paging })
  );
  if (cacheResults) {
    logger.info({
      path: req.originalUrl,
      req_id: req.req_id,
      response: cacheResults,
    });
    return res.status(200).json({
      data: {
        tasks: JSON.parse(cacheResults),
      },
      error: null,
    });
  }

  next();
};

module.exports = cachedData;
