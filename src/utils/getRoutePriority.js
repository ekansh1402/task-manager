const { redisClient } = require("../config/redis");
const { db } = require("../config/db");
const { COLLECTION } = require("../constants");
let DB;
const getDb = async () => {
  if (DB) return DB.collection(COLLECTION.ROUTE);
  DB = await db();
  return DB.collection(COLLECTION.ROUTE);
};

const getRoutePriority = async (route) => {
  let priority = await redisClient.get(route);
  if (priority) {
    return priority;
  }
  const db = await getDb();
  priority = await db.findOne({ path: route }, { projection: { priority: 1 } });
  await redisClient.setex(route, 10000, priority.priority);
  return priority.priority;
};

module.exports = getRoutePriority;
