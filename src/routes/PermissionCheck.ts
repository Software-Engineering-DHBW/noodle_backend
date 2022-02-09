import { Request, Response } from 'express';
import { JwtPayload } from './index';

const administratorRole = 'administrator';
const teacherRole = 'teacher';
const studentRole = 'student';

const forbiddenRequest = (res: Response) => {
  res.sendStatus(403);
};

/**
 * @exports
 * Check, if the user has a administrator session
 * @param {Request} req - Received reqeust object
 * @param {Response} res - Received response object
 * @param {Function} next - Callback function
 */
export const checkAdministrator = (req: Request, res: Response, next: Function) => {
  const { session } = req;
  if (session.role === administratorRole) {
    next(req, res);
  } else {
    forbiddenRequest(res);
  }
};

/**
 * @exports
 * Check, if the user has a administrator session or
 * if the username equals the username in the request body.
 * @param {Request} req - Received reqeust object
 * @param {Response} res - Received response object
 * @param {Function} next - Callback function
 */
export const checkAdministratorOrOwnUsername = (req: Request, res: Response, next: Function) => {
  const { session } = req;
  const { username } = req.body;
  if (session.role === administratorRole || session.username === username) {
    next(req, res);
  } else {
    forbiddenRequest(res);
  }
};
