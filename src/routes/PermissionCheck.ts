import { Request, Response } from 'express';
import { JwtPayload } from './index';

const forbiddenRequest = (res: Response) => {
  res.sendStatus(403);
};

const checkUsername = (
  session: JwtPayload,
  username: string,
): boolean => session.username === username;

const checkId = (
  session: JwtPayload,
  id: number,
): boolean => session.id === id;

const checkAdministratorRole = (session: JwtPayload): boolean => session.role === 'administrator';

/**
 * @exports
 * Check, if the user has a administrator session
 * @param {Request} req - Received reqeust object
 * @param {Response} res - Received response object
 * @param {Function} next - Callback function
 */
export const checkAdministrator = (req: Request, res: Response, next: Function) => {
  const { session } = req;
  if (checkAdministratorRole(session)) {
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
  if (checkAdministratorRole(session) || checkUsername(session, username)) {
    next(req, res);
  } else {
    forbiddenRequest(res);
  }
};

/**
 * @exports
 * Check, if the user has a administrator session or
 * if the session id equals the iid in the request body.
 * @param {Request} req - Received reqeust object
 * @param {Response} res - Received response object
 * @param {Function} next - Callback function
 */
export const checkAdministratorOrOwnID = (req: Request, res: Response, next: Function) => {
  const { session } = req;
  const { id } = req.body;
  if (checkAdministratorRole(session) || checkId(session, id)) {
    next(req, res);
  } else {
    forbiddenRequest(res);
  }
};

/**
 * @exports
 * Check, if the user has a administrator sessior or
 * if the session id has the moduel it tries to access
 * and is a teacher of the module
 * @param {Request} req - Received reqeust object
 * @param {Response} res - Received response object
 * @param {Function} next - Callback function
 */
export const checkAdministratorOrModuleTeacher = (req: Request, res: Response, next: Function) => {
  const { session } = req;
  const { moduleId } = req.body;
};
