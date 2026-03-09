const User = require("../models/userModel");

// Update User Profile
const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;

    // find user by id from auth middleware
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // update fields
    if (name) {
      user.name = name;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser
    });

  } catch (error) {
    console.log("Update Profile Error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  updateProfile
};