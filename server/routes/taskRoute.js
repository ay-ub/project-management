const express = require("express");

const router = express.Router();

const taskController = require("../controllers/taskController");
const authController = require("../middleware/authMiddleware");

router
  .route("/")
  .get(authController, taskController.getAllTasks)
  .post(authController, taskController.createTask);

router
  .route("/:taskId")
  .get(authController, taskController.getTaskDetails)
  .patch(authController, taskController.updateTask)
  .delete(authController, taskController.deleteTask);

module.exports = router;
