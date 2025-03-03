const task = require("../models/task");
const { redisClient } = require("../config/redis");
const response = require("../utils/response");

async function addTaskServices(data, user_id) {
  const res = await task.addTask(data, user_id);
  await redisClient.del(user_id);
  return response(res.status, res.message);
}

async function getTaskServices(data, paging) {
  let filter = {};
  filter.user_id = data.user_id;
  if (data.name) filter.name = data.name;
  if (data.status) filter.status = data.status;

  const res = await task.getTask(filter, paging);
  await redisClient.setex(
    JSON.stringify({ ...filter, ...paging }),
    600,
    JSON.stringify({ user: res.data.user_data, entries: res.data.entries })
  );
  return response(res.status, res.message, res.data);
}
async function getAllTaskServices(data, paging) {
  const res = await task.getAllTask(data, paging);
  await redisClient.setex(
    JSON.stringify({ ...data, ...paging }),
    600,
    JSON.stringify({ user: res.data.user_data, entries: res.data.entries })
  );
  return response(res.status, res.message, res.data);
}

async function updateTaskServices(data, user_id) {
  await redisClient.del(user_id);
  const res = await task.updateTask(data);
  return response(res.status, res.message);
}

async function deleteTaskServices(data, user_id) {
  const res = await task.deleteTask(data);
  await redisClient.del(user_id);
  return response(res.status, res.message);
}
module.exports = {
  addTaskServices,
  getTaskServices,
  deleteTaskServices,
  updateTaskServices,
  getAllTaskServices,
};
