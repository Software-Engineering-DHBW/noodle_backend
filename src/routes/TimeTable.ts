import { Request, Response } from 'express';
import Timetable from '../entity/Timetable';
import {
  saveObject, getObjects, getOneObject, deleteObjects,
} from './Manager';
import User from '../entity/User';

/**
 * @exports
 * @async
 * Insert a new entry into the repository `Timetable`
 * @param {Request} req - Received request object
 * @param {Response} res - Received response object
 */
export const insertTimetableEntry = async (req: Request, res: Response) => {
  try {
    const data: Timetable = req.body;
    saveObject(data, Timetable);
    res.status(200).send('The entry has been saved');
  } catch (_err) {
    res.status(500).send('The entry could not be saved');
  }
};

/**
 * @exports
 * @async
 * Selects the timetable entries for a student or a teacher
 * @param {Request} req - Received request object
 * @param {Response} res - Received response object
 */
export const getTimeTableEntriesPerson = async (req: Request, res: Response) => {
  try {
    let searchOptions = {};
    if (req.session.role === 'teacher') {
      searchOptions = {
        where: {
          assignedModule: {
            assignedTeacher: req.session.id,
          },
        },
        relations: ['assignedModule'],
      };
    } else {
      const studentCourseId: any = await getOneObject({
        where: {
          username: req.session.username,
        },
        relations: ['course'],
      }, User);
      searchOptions = {
        where: {
          assignedModule: {
            assignedCourse: studentCourseId.course.id,
          },
        },
        relations: ['assignedModule', 'assignedModule.assignedCourse'],
      };
    }
    res.status(200).send(await getObjects(searchOptions, Timetable));
  } catch (_err) {
    res.status(500).send('The entries could not be retrieved');
  }
};

/**
 * @exports
 * @async
 * Selects the timetable entries for a student
 * @param {Request} req - Received request object
 * @param {Response} res - Received response object
 */
export const getTimeTableEntriesCourse = async (req: Request, res: Response) => {
  try {
    const searchOptions = {
      where: {
        assignedModule: {
          assignedCourse: req.params.courseId,
        },
      },
      relations: ['assignedModule', 'assignedModule.assignedCourse'],
    };
    res.status(200).send(await getObjects(searchOptions, Timetable));
  } catch (_err) {
    res.status(500).send('The entries could not be retrieved');
  }
};

/**
 * @exports
 * @async
 * Selects the timetable entries for a module
 * @param {Request} req - Received request object
 * @param {Response} res - Received response object
 */
export const getTimeTableEntriesModule = async (req: Request, res: Response) => {
  try {
    const searchOptions = {
      where: {
        assignedModule: {
          assignedCourse: req.params.moduleId,
        },
      },
      relations: ['assignedModule'],
    };
    res.status(200).send(await getObjects(searchOptions, Timetable));
  } catch (_err) {
    res.status(500).send('The entries could not be retrieved');
  }
};

/**
 * @exports
 * @async
 * Deletes the specified timetable entries
 * @param {Request} req - Received request object
 * @param {Response} res - Received response object
 */
export const deleteTimeTableEntriesModule = async (req: Request, res: Response) => {
  try {
    const data: Timetable = req.body;
    deleteObjects(data, Timetable);
    res.status(204).send('The entry has been deleted');
  } catch (_err) {
    res.status(500).send('The entry could not be deleted');
  }
};
