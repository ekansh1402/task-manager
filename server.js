require("dotenv").config();
const express = require("express");
const cookieparser = require("cookie-parser");
const { db } = require("./src/config/db");
const route = require("./src/routes/index");
const { errorRoute } = require("./src/middleware/errorHandler");
const { assign_id, morganMiddleware } = require("./src/middleware/morgan");
const logger = require("./src/utils/logger");
require("./src/utils/cronHardDeleteTask");
const app = express();
app.use(assign_id);
app.use(morganMiddleware);
app.use(express.json());
app.use(cookieparser());
app.use("/api/v1", route);
app.use(errorRoute);

const port = process.env.PORT;

(async () => {
  try {
    await db();
    app.listen(port, () => {});
  } catch (err) {
    logger.error("Error during startup:", err);
    process.exit(1);
  }
})();
