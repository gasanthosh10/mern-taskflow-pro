import { HttpError } from '../utils/httpError.js';

export const validate = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const message = result.error.issues.map((issue) => issue.message).join(', ');
    return next(new HttpError(message, 400));
  }

  req.body = result.data;
  next();
};

