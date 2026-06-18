import { Router } from 'express';
import { z } from 'zod';
import { addComment, createTask, deleteTask, getTasks, updateTask } from '../controllers/taskController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { taskSchema, updateTaskSchema } from '../validators/taskSchemas.js';

const router = Router();

router.use(protect);
router.get('/', getTasks);
router.post('/', validate(taskSchema), createTask);
router.patch('/:id', validate(updateTaskSchema), updateTask);
router.delete('/:id', deleteTask);
router.post('/:id/comments', validate(z.object({ text: z.string().min(1) })), addComment);

export default router;

