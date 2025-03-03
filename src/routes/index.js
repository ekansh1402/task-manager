const app = require("express").Router();

const auth_route = require("./authRoutes");
const task_route = require("./taskRoutes");
const auth = require("../middleware/auth");
const authorization = require("../middleware/authorization");
app.use("/auth", auth_route);
app.use("/task", auth, authorization, task_route);

module.exports = app;
