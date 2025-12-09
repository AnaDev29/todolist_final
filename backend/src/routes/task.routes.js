import express from 'express';
import { getTasks, createTask, updateTask, deleteTask, deleteCompletedTasks } from '../controllers/task.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.delete('/completed/all', deleteCompletedTasks);

export default router;
