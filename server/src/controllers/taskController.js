import { Activity } from '../models/Activity.js';
import { Task } from '../models/Task.js';
import { HttpError } from '../utils/httpError.js';

const populateTask = (query) =>
  query
    .populate('project', 'name color')
    .populate('assignee', 'name email avatarColor')
    .populate('createdBy', 'name email avatarColor')
    .populate('comments.author', 'name email avatarColor');

export const getTasks = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.status) filters.status = req.query.status;
    if (req.query.priority) filters.priority = req.query.priority;
    if (req.query.project) filters.project = req.query.project;

    const tasks = await populateTask(Task.find(filters)).sort({ dueDate: 1 });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const task = await Task.create({ ...req.body, createdBy: req.user._id });
    await Activity.create({
      actor: req.user._id,
      action: 'created task',
      target: task.title,
      task: task._id,
      project: task.project
    });

    const populated = await populateTask(Task.findById(task._id));
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!task) throw new HttpError('Task not found', 404);

    await Activity.create({
      actor: req.user._id,
      action: 'updated task',
      target: task.title,
      task: task._id,
      project: task.project
    });

    const populated = await populateTask(Task.findById(task._id));
    res.json(populated);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) throw new HttpError('Task not found', 404);

    await Activity.create({
      actor: req.user._id,
      action: 'deleted task',
      target: task.title,
      project: task.project
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) throw new HttpError('Task not found', 404);

    task.comments.push({ author: req.user._id, text: req.body.text });
    await task.save();

    const populated = await populateTask(Task.findById(task._id));
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

