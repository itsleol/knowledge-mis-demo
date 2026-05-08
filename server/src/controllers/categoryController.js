const Category = require("../models/Category");

async function listCategories(req, res, next) {
  try {
    const items = await Category.find().populate("parentId", "name code").sort({ code: 1 });
    res.json({ items });
  } catch (error) {
    next(error);
  }
}

async function createCategory(req, res, next) {
  try {
    const item = await Category.create(req.body);
    res.status(201).json({ item });
  } catch (error) {
    next(error);
  }
}

async function updateCategory(req, res, next) {
  try {
    const item = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: "Category not found." });
    res.json({ item });
  } catch (error) {
    next(error);
  }
}

async function deleteCategory(req, res, next) {
  try {
    const children = await Category.countDocuments({ parentId: req.params.id });
    if (children > 0) return res.status(400).json({ message: "Cannot delete a category that has child categories." });
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted." });
  } catch (error) {
    next(error);
  }
}

module.exports = { listCategories, createCategory, updateCategory, deleteCategory };
