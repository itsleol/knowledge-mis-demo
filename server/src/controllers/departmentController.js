const Department = require("../models/Department");
const User = require("../models/User");

async function listDepartments(req, res, next) {
  try {
    const items = await Department.find().populate("parentId", "name code").sort({ code: 1 });
    res.json({ items });
  } catch (error) {
    next(error);
  }
}

async function createDepartment(req, res, next) {
  try {
    const item = await Department.create({ ...req.body, parentId: req.body.parentId || null });
    res.status(201).json({ item });
  } catch (error) {
    next(error);
  }
}

async function updateDepartment(req, res, next) {
  try {
    const item = await Department.findByIdAndUpdate(
      req.params.id,
      { ...req.body, parentId: req.body.parentId || null },
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ message: "Department not found." });
    res.json({ item });
  } catch (error) {
    next(error);
  }
}

async function deleteDepartment(req, res, next) {
  try {
    const users = await User.countDocuments({ department: req.params.id });
    if (users > 0) return res.status(400).json({ message: "Cannot delete a department that still has users." });
    const children = await Department.countDocuments({ parentId: req.params.id });
    if (children > 0) return res.status(400).json({ message: "Cannot delete a department that has child departments." });
    await Department.findByIdAndDelete(req.params.id);
    res.json({ message: "Department deleted." });
  } catch (error) {
    next(error);
  }
}

module.exports = { listDepartments, createDepartment, updateDepartment, deleteDepartment };
