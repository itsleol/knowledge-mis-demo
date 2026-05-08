const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { jwtSecret } = require("../config");

async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "Missing authentication token." });
    }

    const payload = jwt.verify(token, jwtSecret);
    const user = await User.findById(payload.id).populate("department");
    if (!user || user.status !== "active") {
      return res.status(401).json({ message: "User is not active or no longer exists." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired authentication token." });
  }
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "You do not have permission to perform this action." });
    }
    next();
  };
}

module.exports = { authenticate, authorize };
