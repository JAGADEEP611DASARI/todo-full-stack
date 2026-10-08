const express = require("express");
const mongoose = require("mongoose");
const Todo = require("../models/Todo");

const router = express.Router();

function validateId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid todo ID"
    });
  }
  next();
}

// GET all todos
router.get("/", async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status === "completed") filter.completed = true;
    if (status === "active") filter.completed = false;

    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: "i" } },
        { description: { $regex: search.trim(), $options: "i" } }
      ];
    }

    const todos = await Todo.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: todos.length,
      data: todos
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET one todo
router.get("/:id", validateId, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found"
      });
    }

    res.json({ success: true, data: todo });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// CREATE todo
router.post("/", async (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;

    const todo = await Todo.create({
      title,
      description,
      priority,
      dueDate: dueDate || null
    });

    res.status(201).json({
      success: true,
      message: "Todo created successfully",
      data: todo
    });
  } catch (error) {
    const status = error.name === "ValidationError" ? 400 : 500;
    res.status(status).json({
      success: false,
      message: error.message
    });
  }
});

// UPDATE todo
router.put("/:id", validateId, async (req, res) => {
  try {
    const allowed = ["title", "description", "completed", "priority", "dueDate"];
    const updates = {};

    allowed.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        updates[key] = req.body[key];
      }
    });

    const todo = await Todo.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found"
      });
    }

    res.json({
      success: true,
      message: "Todo updated successfully",
      data: todo
    });
  } catch (error) {
    const status = error.name === "ValidationError" ? 400 : 500;
    res.status(status).json({
      success: false,
      message: error.message
    });
  }
});

// TOGGLE completion
router.patch("/:id/toggle", validateId, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found"
      });
    }

    todo.completed = !todo.completed;
    await todo.save();

    res.json({
      success: true,
      message: "Todo status changed",
      data: todo
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE todo
router.delete("/:id", validateId, async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found"
      });
    }

    res.json({
      success: true,
      message: "Todo deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
