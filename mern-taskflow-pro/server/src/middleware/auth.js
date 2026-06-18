import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { HttpError } from '../utils/httpError.js';

export const protect = async (req, _res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith('Bearer ')) {
      throw new HttpError('Authentication token missing', 401);
    }

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      throw new HttpError('User no longer exists', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    next(error.statusCode ? error : new HttpError('Invalid or expired token', 401));
  }
};

