import { z } from 'zod';

export const projectSchema = z.object({
  name: z.string().min(3, 'Project name must be at least 3 characters'),
  description: z.string().optional().default(''),
  status: z.enum(['Planning', 'In Progress', 'Review', 'Completed']).optional(),
  dueDate: z.string().min(1, 'Due date is required'),
  members: z.array(z.string()).optional().default([]),
  color: z.string().optional().default('#2563eb')
});

