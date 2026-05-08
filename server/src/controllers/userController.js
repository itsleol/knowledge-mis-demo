const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Department = require("../models/Department");

async function listUsers(req, res, next) {
  try {
    const items = await User.find().populate("department", "name code").select("-passwordHash").sort({ createdAt: -1 });
    const departments = await Department.find().sort({ code: 1 });
    res.json({ items, departments });
  } catch (error) {
    next(error);
  }
}

async function createUser(req, res, next) {
  try {
    const passwordHash = await bcrypt.hash(req.body.password || "password123", 10);
    const item = await User.create({ ...req.body, passwordHash });
    const populated = await item.populate("department", "name code");
    const data = populated.toObject();
    delete data.passwordHash;
    res.status(201).json({ item: data });
  } catch (error) {
    next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    const update = { ...req.body };
    if (update.password) {
      update.passwordHash = await bcrypt.hash(update.password, 10);
      delete update.password;
    }
    const item = await User.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true })
      .populate("department", "name code")
      .select("-passwordHash");
    if (!item) return res.status(404).json({ message: "User not found." });
    res.json({ item });
  } catch (error) {
    next(error);
  }
}

module.exports = { listUsers, createUser, updateUser };
