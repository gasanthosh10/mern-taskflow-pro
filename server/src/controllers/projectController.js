import { Project } from '../models/Project.js';
import { Activity } from '../models/Activity.js';

export const getProjects = async (_req, res, next) => {
  try {
    const projects = await Project.find()
      .populate('owner', 'name email avatarColor')
      .populate('members', 'name email avatarColor')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const project = await Project.create({
      ...req.body,
      owner: req.user._id,
      members: [...new Set([req.user._id.toString(), ...req.body.members])]
    });

    await Activity.create({
      actor: req.user._id,
      action: 'created project',
      target: project.name,
      project: project._id
    });

    const populated = await project.populate([
      { path: 'owner', select: 'name email avatarColor' },
      { path: 'members', select: 'name email avatarColor' }
    ]);
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};
