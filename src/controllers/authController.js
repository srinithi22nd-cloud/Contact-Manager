import User from '../models/User.js';
import generateToken from '../utility/tokenGenerator.js';


// REGISTER USER
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const user = await User.create({
      name,
      email,
      password
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (user && await user.matchPassword(password)) {

      res.json({
        success: true,
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });

    } else {
      res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// GET CURRENT USER
const getMe = async (req, res) => {
  try {

    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// UPDATE PROFILE
const updateProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser
    });

  } catch (error) {

    console.error("Update Profile Error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};



// DELETE PROFILE
const deleteProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "Account deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  deleteProfile
};