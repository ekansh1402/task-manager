const { MongoClient } = require("mongodb");
const logger = require("../utils/logger");
const { ErrorHandler } = require("../middleware/errorHandler");
const { SERVICE_UNAVAILABLE } = require("http-status-codes");
require("dotenv").config();

const URL = process.env.DATABASE_URL;
const client = new MongoClient(URL);

let database = undefined;

async function db() {
  try {
    if (database) return database;

    await client.connect();
    database = client.db("task_manager");
    return database;
  } catch (error) {
    logger.error("DB not connected:", error);
    throw new ErrorHandler(
      SERVICE_UNAVAILABLE,
      "DMS-VEO",
      "DB was unable to connect"
    );
  }
}
module.exports = { db };
