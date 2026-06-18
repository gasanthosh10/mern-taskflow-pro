import { Router } from 'express';
import { createProject, getProjects } from '../controllers/projectController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { projectSchema } from '../validators/projectSchemas.js';

const router = Router();

router.use(protect);
router.get('/', getProjects);
router.post('/', validate(projectSchema), createProject);

export default router;

