import { z } from 'zod';

export const taskSchema = z.object({
  title: z.string().min(3, 'Task title must be at least 3 characters'),
  description: z.string().optional().default(''),
  status: z.enum(['Backlog', 'In Progress', 'Review', 'Done']).optional(),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']).optional(),
  dueDate: z.string().min(1, 'Due date is required'),
  project: z.string().min(1, 'Project is required'),
  assignee: z.string().min(1, 'Assignee is required'),
  tags: z.array(z.string()).optional().default([])
});

export const updateTaskSchema = taskSchema.partial();

