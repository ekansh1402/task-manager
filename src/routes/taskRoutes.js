const router = require("express").Router();

const validateRequest = require("../middleware/validation");
const taskValidator = require("../validators/taskValidators");
const cachedData = require("../middleware/redis");
const controller = require("../controllers/taskController");

router.post(
  "/addtask",
  validateRequest(taskValidator.createTaskSchema),
  controller.addTask
);
router.post(
  "/updatetask/:page_no/:page_size",
  validateRequest(taskValidator.updateTaskSchema),
  controller.updateTask
);
router.delete(
  "/deletetask",
  validateRequest(taskValidator.taskIdSchema),
  controller.deleteTask
);
router.post("/gettask", cachedData, controller.getTask);
router.post("/getalltask", controller.getAllTask);
router.delete("/harddelete", controller.hardDeleteTask);
module.exports = router;
