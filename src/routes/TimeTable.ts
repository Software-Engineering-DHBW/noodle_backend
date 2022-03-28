import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Timetable from '../entity/Timetable';
import {
  saveObject, getObjects, getOneObject, deleteObjects,
} from './Manager';
import User from '../entity/User';

/**
 * @async
 * Insert a new entry into the repository `Timetable` <br>
 * Corresponding API-Call: {@link https://github.com/Software-Engineering-DHBW/noodle_backend/wiki/API#post-timetableinsert | POST /timetable/insert}
 * @param {Request} req - Received request object
 * @param {Response} res - Received response object
 */
export const insertTimetableEntry = async (req: Request, res: Response) => {
  try {
    const data: Timetable = req.body;
    await saveObject(data, Timetable);
    res.status(200).send('The entry has been saved');
  } catch (_err) {
    res.status(500).send('The entry could not be saved');
  }
};

/**
 * @async
 * Selects the timetable entries for a student or a teacher <br>
 * Corresponding API-Call: {@link https://github.com/Software-Engineering-DHBW/noodle_backend/wiki/API#get-timetablegetperson | GET /timetable/getPerson}
 * @param {Request} req - Received request object
 * @param {Response} res - Received response object
 */
export const getTimeTableEntriesPerson = async (req: Request, res: Response) => {
  try {
    let searchOptions = {};
    if (req.session.role === 'teacher') {
      const entries: Timetable[] = await getRepository(Timetable)
        .createQueryBuilder('')
        .select([
          'Timetable.id',
          'Timetable.startTime',
          'Timetable.endTime',
          'Timetable.description',
          'Timetable.room',
          'Module.id',
          'Module.name',
          'Module.description',
          'Course.id',
          'Course.name',
        ])
        .leftJoin('Timetable.assignedModule', 'Module')
        .leftJoin('Module.assignedCourse', 'Course')
        .leftJoin('Module.assignedTeacher', 'User')
        .where('User.id = :id', { id: req.session.id })
        .getMany();
      res.status(200).send(entries);
      return;
    }
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

    res.status(200).send(await getObjects(searchOptions, Timetable));
  } catch (_err) {
    console.log(_err);
    res.status(500).send('The entries could not be retrieved');
  }
};

/**
 * @async
 * Selects the timetable entries for a student <br>
 * Corresponding API-Call: {@link https://github.com/Software-Engineering-DHBW/noodle_backend/wiki/API#get-timetablegetcoursecourseid | GET /timetable/getCourse/:courseId}
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
 * @async
 * Selects the timetable entries for a module <br>
 * Corresponding API-Call: {@link https://github.com/Software-Engineering-DHBW/noodle_backend/wiki/API#get-timetablegetmodulemoduleid | GET /timetable/getModule/:moduleId}
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
 * @async
 * Deletes the specified timetable entries <br>
 * Corresponding API-Call: {@link https://github.com/Software-Engineering-DHBW/noodle_backend/wiki/API#post-timetabledelete | POST /timetable/delete}
 * @param {Request} req - Received request object
 * @param {Response} res - Received response object
 */
export const deleteTimeTableEntriesModule = async (req: Request, res: Response) => {
  try {
    const data: Timetable = req.body;
    await deleteObjects(data, Timetable);
    res.status(204).send('The entry has been deleted');
  } catch (_err) {
    res.status(500).send('The entry could not be deleted');
  }
};
