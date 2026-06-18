import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDb } from '../config/db.js';
import { Activity } from '../models/Activity.js';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { User } from '../models/User.js';

dotenv.config();

const addDays = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const run = async () => {
  await connectDb(process.env.MONGO_URI);
  await Promise.all([User.deleteMany(), Project.deleteMany(), Task.deleteMany(), Activity.deleteMany()]);

  const users = await User.create([
    { name: 'Aarav Mehta', email: 'admin@taskflow.dev', password: 'password123', role: 'Admin', avatarColor: '#0f766e' },
    { name: 'Diya Rao', email: 'diya@taskflow.dev', password: 'password123', role: 'Manager', avatarColor: '#7c3aed' },
    { name: 'Kabir Shah', email: 'kabir@taskflow.dev', password: 'password123', role: 'Member', avatarColor: '#ea580c' },
    { name: 'Mira Iyer', email: 'mira@taskflow.dev', password: 'password123', role: 'Member', avatarColor: '#2563eb' }
  ]);

  const [admin, diya, kabir, mira] = users;

  const projects = await Project.create([
    {
      name: 'Client Portal Redesign',
      description: 'Refresh the customer dashboard and improve ticket visibility.',
      status: 'In Progress',
      dueDate: addDays(24),
      owner: admin._id,
      members: users.map((user) => user._id),
      color: '#2563eb'
    },
    {
      name: 'Mobile Launch Sprint',
      description: 'Prepare the first mobile release with onboarding and analytics.',
      status: 'Review',
      dueDate: addDays(14),
      owner: diya._id,
      members: [diya._id, kabir._id, mira._id],
      color: '#0f766e'
    },
    {
      name: 'Automation Backlog',
      description: 'Reduce manual operations with workflow automation.',
      status: 'Planning',
      dueDate: addDays(35),
      owner: admin._id,
      members: [admin._id, kabir._id],
      color: '#c2410c'
    }
  ]);

  const tasks = await Task.create([
    {
      title: 'Finalize dashboard information architecture',
      description: 'Lock the navigation, board states, and activity feed layout.',
      status: 'Done',
      priority: 'High',
      dueDate: addDays(-2),
      project: projects[0]._id,
      assignee: diya._id,
      createdBy: admin._id,
      tags: ['ux', 'dashboard']
    },
    {
      title: 'Build task drag-and-drop API contract',
      description: 'Document status update payloads and optimistic UI behavior.',
      status: 'In Progress',
      priority: 'Urgent',
      dueDate: addDays(3),
      project: projects[0]._id,
      assignee: kabir._id,
      createdBy: admin._id,
      tags: ['api', 'tasks']
    },
    {
      title: 'QA mobile onboarding checklist',
      description: 'Test account creation, forgot password, and guided setup.',
      status: 'Review',
      priority: 'Medium',
      dueDate: addDays(6),
      project: projects[1]._id,
      assignee: mira._id,
      createdBy: diya._id,
      tags: ['qa', 'mobile']
    },
    {
      title: 'Create weekly project health report',
      description: 'Generate charts for project velocity, blockers, and ownership.',
      status: 'Backlog',
      priority: 'Medium',
      dueDate: addDays(11),
      project: projects[2]._id,
      assignee: admin._id,
      createdBy: admin._id,
      tags: ['reporting']
    },
    {
      title: 'Connect notification preference settings',
      description: 'Allow users to choose task, comment, and deadline alerts.',
      status: 'In Progress',
      priority: 'High',
      dueDate: addDays(8),
      project: projects[1]._id,
      assignee: kabir._id,
      createdBy: diya._id,
      tags: ['settings', 'notifications']
    }
  ]);

  await Activity.create([
    { actor: admin._id, action: 'created project', target: projects[0].name, project: projects[0]._id },
    { actor: diya._id, action: 'moved task to review', target: tasks[2].title, task: tasks[2]._id, project: projects[1]._id },
    { actor: kabir._id, action: 'updated task', target: tasks[1].title, task: tasks[1]._id, project: projects[0]._id },
    { actor: mira._id, action: 'commented on task', target: tasks[2].title, task: tasks[2]._id, project: projects[1]._id }
  ]);

  console.log('Seed complete');
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});

