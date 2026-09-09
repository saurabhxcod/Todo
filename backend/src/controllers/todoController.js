import { TodoModel } from '../models/todoModel.js';

/**
 * Todo Controller (MVC)
 * 
 * Handles HTTP requests and coordinates with the Todo model.
 * NOTE: CRUD logic is stubbed and ready for implementation upon request.
 */

// @desc    Get all todos
// @route   GET /api/todos
// @access  Public
export const getAllTodos = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Todo MVC Controller: getAllTodos endpoint ready for CRUD implementation.',
      data: []
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single todo by ID
// @route   GET /api/todos/:id
// @access  Public
export const getTodoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    res.status(200).json({
      success: true,
      message: `Todo MVC Controller: getTodoById (${id}) endpoint ready for CRUD implementation.`,
      data: null
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new todo
// @route   POST /api/todos
// @access  Public
export const createTodo = async (req, res, next) => {
  try {
    const validation = TodoModel.validate(req.body);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validation.errors
      });
    }

    res.status(201).json({
      success: true,
      message: 'Todo MVC Controller: createTodo endpoint ready for CRUD implementation.',
      receivedPayload: req.body
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing todo
// @route   PUT /api/todos/:id
// @access  Public
export const updateTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    res.status(200).json({
      success: true,
      message: `Todo MVC Controller: updateTodo (${id}) endpoint ready for CRUD implementation.`,
      updatedFields: req.body
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a todo
// @route   DELETE /api/todos/:id
// @access  Public
export const deleteTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    res.status(200).json({
      success: true,
      message: `Todo MVC Controller: deleteTodo (${id}) endpoint ready for CRUD implementation.`
    });
  } catch (error) {
    next(error);
  }
};
