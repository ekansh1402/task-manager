const Joi = require("joi");

const createTaskSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  status: Joi.string().max(500).required(),
  deadline: Joi.date().required(),
  username: Joi.string().optional(),
});

const updateTaskSchema = Joi.object({
  task_id: Joi.string().min(24).max(24).required(),
  status: Joi.string().valid("pending", "in-progress", "completed").optional(),
  deadline: Joi.date().optional(),
});

const taskIdSchema = Joi.object({
  task_id: Joi.string().min(24).max(24).required(),
});

module.exports = {
  createTaskSchema,
  updateTaskSchema,
  taskIdSchema,
};
