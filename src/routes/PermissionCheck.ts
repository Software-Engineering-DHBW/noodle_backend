import { Request, Response } from 'express';
import { getManager } from 'typeorm';
import { JwtPayload } from './index';
import Module from '../entity/Module';
import { getOneObject } from './Manager';

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
 * Check, if the user has a administrator session <br>
 * Session-Content: {@link https://github.com/Software-Engineering-DHBW/noodle_backend/wiki/API#payload-of-the-jwt | Payload JWT}
 * @param {Request} req - Received request object
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
 * Check, if the user has a administrator session or
 * if the username equals the username in the request body. <br>
 * Session-Content: {@link https://github.com/Software-Engineering-DHBW/noodle_backend/wiki/API#payload-of-the-jwt | Payload JWT}
 * @param {Request} req - Received request object
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
 * Check, if the user has a administrator session or
 * if the session id equals the iid in the request body. <br>
 * Session-Content: {@link https://github.com/Software-Engineering-DHBW/noodle_backend/wiki/API#payload-of-the-jwt | Payload JWT}
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
 * Check, if the user has a administrator sessior or
 * if the session id has the moduel it tries to access
 * and is a teacher of the module <br>
 * Session-Content: {@link https://github.com/Software-Engineering-DHBW/noodle_backend/wiki/API#payload-of-the-jwt | Payload JWT}
 * @param {Request} req - Received reqeust object
 * @param {Response} res - Received response object
 * @param {Function} next - Callback function
 */
export const checkAdministratorOrModuleTeacher = async (
  req: Request,
  res: Response,
  next: Function,
) => {
  const { session } = req;
  if (checkAdministratorRole(session)) {
    next(req, res);
    return;
  }
  const { moduleId } = req.params;
  try {
    const databaseData: object = await getOneObject({
      where: {
        id: moduleId,
      },
      relations: ['assignedTeacher'],
    }, Module);
    const module: Module = getManager().create(Module, databaseData);
    if (module.assignedTeacher.some((e) => e.id === session.id)) {
      next(req, res);
    } else {
      forbiddenRequest(res);
    }
  } catch (_err) {
    forbiddenRequest(res);
  }
};
