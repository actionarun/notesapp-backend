const express = require("express");
const router = express.Router();
const {
  register,
  verifyEmail,
  login,
  getMe,
  updateMe,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.post("/register", register);
router.get("/verify-email/:token", verifyEmail);
router.post("/login", login);
router.get("/me", protect, getMe);
router.put("/me", protect, upload.single("avatar"), updateMe);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
