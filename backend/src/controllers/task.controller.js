import { Task } from '../models/index.js';

// @desc    Obtener todas las tareas del usuario
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener tareas'
    });
  }
};

// @desc    Crear nueva tarea
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'El texto de la tarea es requerido'
      });
    }

    const task = await Task.create({
      text,
      userId: req.user.id,
      completed: false
    });

    res.status(201).json({
      success: true,
      message: 'Tarea creada exitosamente',
      data: task
    });
  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear tarea'
    });
  }
};

// @desc    Actualizar tarea
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, completed } = req.body;

    const task = await Task.findOne({
      where: { id, userId: req.user.id }
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }

    // Actualizar campos
    if (text !== undefined) task.text = text;
    if (completed !== undefined) task.completed = completed;

    await task.save();

    res.json({
      success: true,
      message: 'Tarea actualizada exitosamente',
      data: task
    });
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar tarea'
    });
  }
};

// @desc    Eliminar tarea
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({
      where: { id, userId: req.user.id }
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }

    await task.destroy();

    res.json({
      success: true,
      message: 'Tarea eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar tarea'
    });
  }
};

// @desc    Eliminar todas las tareas completadas
// @route   DELETE /api/tasks/completed
// @access  Private
export const deleteCompletedTasks = async (req, res) => {
  try {
    const result = await Task.destroy({
      where: {
        userId: req.user.id,
        completed: true
      }
    });

    res.json({
      success: true,
      message: `${result} tarea(s) eliminada(s)`,
      count: result
    });
  } catch (error) {
    console.error('Error al eliminar tareas completadas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar tareas completadas'
    });
  }
};
