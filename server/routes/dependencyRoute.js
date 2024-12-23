const express = require("express");
const router = express.Router();

const dependencyController = require("../controllers/dependencyController");
const authController = require("../middleware/authMiddleware");
router.route("/").post(authController, dependencyController.createDependency);

router
  .route("/:dependencyId")
  .delete(authController, dependencyController.deleteDependency);

module.exports = router;
