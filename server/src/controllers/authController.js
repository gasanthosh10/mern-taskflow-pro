import { User } from '../models/User.js';
import { HttpError } from '../utils/httpError.js';
import { generateToken } from '../utils/generateToken.js';

const userPayload = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatarColor: user.avatarColor
});

export const register = async (req, res, next) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) throw new HttpError('Email is already registered', 409);

    const user = await User.create(req.body);
    res.status(201).json({ user: userPayload(user), token: generateToken(user._id) });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await user.matchPassword(req.body.password))) {
      throw new HttpError('Invalid email or password', 401);
    }

    res.json({ user: userPayload(user), token: generateToken(user._id) });
  } catch (error) {
    next(error);
  }
};

export const me = (req, res) => {
  res.json({ user: userPayload(req.user) });
};
