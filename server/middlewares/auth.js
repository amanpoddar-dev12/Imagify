import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.json({ success: false, message: "Not Authorized. Login Again" });
  }
  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    if (tokenDecode.id) {
      req.userId = tokenDecode.id;
    } else {
      return res.json({
        success: false,
        message: "Not Authorized. Login Again",
      });
    }
    next();
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export default userAuth;

// middleware/auth.js
// import jwt from "jsonwebtoken";
import User from "../models/users.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Not authorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: `Role (${req.user.role}) not authorized` });
    }
    next();
  };
};
