const express = require("express");
const router = express.Router();

const authController = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");
router.get("/", protect, (req, res) => {
  try {
    delete req.user.iat;
    delete req.user.exp;
    if (req.user) {
      return res.json({ status: "success", data: req.user });
    } else {
      return res
        .status(400)
        .json({ status: "fail", message: "User not authenticated" });
    }
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.delete("/delete/:email", authController.deleteUser);
router.patch("/update/:email", authController.updateUser);

module.exports = router;
