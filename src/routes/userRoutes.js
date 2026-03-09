import express from "express";
import authentication from "../middleware/authMiddleware.js";
import {
  getMe,
  updateProfile,
  deleteProfile
} from "../controllers/authController.js";

const router = express.Router();


// 🔹 GET PROFILE (Protected)
router.get("/profile", authentication, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Profile accessed successfully",
    user: req.user
  });
});


// 🔹 UPDATE PROFILE (Protected)
router.put("/profile", authentication, async (req, res) => {
  try {
    const user = req.user;

    // Update fields if provided
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});


// 🔹 DELETE ACCOUNT (Protected)
router.delete("/profile", authentication, async (req, res) => {
  try {
    await req.user.deleteOne();

    res.status(200).json({
      success: true,
      message: "Account deleted successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});


export default router;