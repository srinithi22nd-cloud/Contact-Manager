import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authentication = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      // verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // find user
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "User not found"
        });
      }

      req.user = user;

      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "No token provided"
      });
    }

  } catch (error) {
    console.error("Auth Error:", error);

    return res.status(401).json({
      success: false,
      message: "Token failed"
    });
  }
};

export default authentication;