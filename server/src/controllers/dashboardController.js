import { Activity } from '../models/Activity.js';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { User } from '../models/User.js';

export const getSummary = async (_req, res, next) => {
  try {
    const [tasks, projects, users, recentActivity] = await Promise.all([
      Task.find().populate('project', 'name color').populate('assignee', 'name avatarColor'),
      Project.find().populate('members', 'name avatarColor'),
      User.find().select('name email role avatarColor'),
      Activity.find().populate('actor', 'name avatarColor').sort({ createdAt: -1 }).limit(8)
    ]);

    const completed = tasks.filter((task) => task.status === 'Done').length;
    const urgent = tasks.filter((task) => task.priority === 'Urgent').length;
    const overdue = tasks.filter((task) => new Date(task.dueDate) < new Date() && task.status !== 'Done').length;

    const statusCounts = ['Backlog', 'In Progress', 'Review', 'Done'].map((status) => ({
      name: status,
      value: tasks.filter((task) => task.status === status).length
    }));

    const priorityCounts = ['Low', 'Medium', 'High', 'Urgent'].map((priority) => ({
      name: priority,
      value: tasks.filter((task) => task.priority === priority).length
    }));

    res.json({
      metrics: {
        totalTasks: tasks.length,
        completed,
        urgent,
        overdue,
        activeProjects: projects.filter((project) => project.status !== 'Completed').length,
        members: users.length
      },
      statusCounts,
      priorityCounts,
      projects,
      tasks,
      users,
      recentActivity
    });
  } catch (error) {
    next(error);
  }
};

