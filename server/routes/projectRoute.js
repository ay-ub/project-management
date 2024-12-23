const express = require("express");
const router = express.Router();

const projectController = require("../controllers/projectController");
const authController = require("../middleware/authMiddleware");
router.route("/").post(authController, projectController.createProject);

router
  .route("/allProject/:userId")
  .get(authController, projectController.getAllProjects);
router
  .route("/:projectId")
  .get(authController, projectController.getProjectDetails)
  .patch(authController, projectController.updateProject)
  .delete(authController, projectController.deleteProject);

module.exports = router;
