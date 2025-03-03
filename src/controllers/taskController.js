const { OK } = require("http-status-codes");
const task = require("../services/taskServices");
const logger = require("../utils/logger");
const { cronHardDeleteTask } = require("../utils/cronHardDeleteTask");

async function addTask(req, res) {
  const data = req.body;
  const user_id = req.user_id;
  const req_id = req.req_id;
  try {
    const response = await task.addTaskServices(data, user_id);
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

async function getTask(req, res) {
  const req_id = req.req_id;
  let paging = {};
  paging.page_no = parseInt(req.query.page) || 1;
  paging.page_size = parseInt(req.query.limit) || 10;
  try {
    const user_id = req.user_id;
    const data = req.body;
    const response = await task.getTaskServices(
      {
        ...data,
        user_id,
      },
      paging
    );
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
    console.log(err);

    return res.status(err.statusCode).json(err.result);
  }
}

async function updateTask(req, res) {
  const req_id = req.req_id;
  try {
    const data = req.body;
    const user_id = req.user_id;
    const response = await task.updateTaskServices(data, user_id);
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

async function deleteTask(req, res) {
  const req_id = req.req_id;
  try {
    const data = req.body;
    const user_id = req.user_id;
    const response = await task.deleteTaskServices(data, user_id);
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

async function getAllTask(req, res) {
  const req_id = req.req_id;
  let paging = {};
  paging.page_no = parseInt(req.query.page) || 1;
  paging.page_size = parseInt(req.query.limit) || 10;
  try {
    const user_id = req.user_id;
    const data = req.body;
    const response = await task.getAllTaskServices(data, paging);
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
    console.log(err);

    return res.status(err.statusCode).json(err.result);
  }
}

async function hardDeleteTask(req, res) {
  const req_id = req.req_id;
  try {
    const response = await cronHardDeleteTask();
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
    console.log(err);

    return res.status(err.statusCode).json(err.result);
  }
}

module.exports = {
  addTask,
  getTask,
  deleteTask,
  updateTask,
  getAllTask,
  hardDeleteTask,
};
