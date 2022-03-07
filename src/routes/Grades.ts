import { Request, Response } from 'express';
import Grades from '../entity/Grades';
import UserDetail from '../entity/UserDetail';
import {
  getObjects, deleteObjects, getOneObject, saveObject,
} from './Manager';

interface ModuleGrade extends Grades {
  studentDetails?: any
}
/**
 * @async
 * Insert or update a grade <br>
 * Corresponding API-Call: {@link https://github.com/Software-Engineering-DHBW/noodle_backend/wiki/API#post-gradesinsert | POST /grades/insert}
 * @param {Request} req - Received request object
 * @param {Response} res - Received response object
 */
export const insertGradeForStudent = async (req: Request, res: Response) => {
  try {
    const data: Grades = req.body;
    await saveObject(data, Grades);
    res.status(200).send('The grade has been saved');
  } catch (_err) {
    res.status(500).send('The grade has not been saved');
  }
};

/**
 * @async
 * Gets the grades for a specific student from the repository 'Grades' <br>
 * Corresponding API-Call: {@link https://github.com/Software-Engineering-DHBW/noodle_backend/wiki/API#get-gradesstudentid | GET /grades/:studentId}
 * @param {Request} req - Received request object
 * @param {Response} res - Received response object
 */
export const getGradesForStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const grades: any = await getObjects({
      select: ['grade', 'weight'],
      where: { studentId },
      relations: ['moduleId'],
    }, Grades);
    res.status(200).send(grades);
  } catch (_err) {
    res.sendStatus(500);
  }
};

/**
 * @async
 * Gets the grades for a specific module from the repository 'Grades'
 * Corresponding API-Call: {@link https://github.com/Software-Engineering-DHBW/noodle_backend/wiki/API#get-gradesmodulemoduleid | GET /grades/module/:moduleId}
 * @param {Request} req - Received request object
 * @param {Response} res - Received response object
 */
export const getGradesForModule = async (req: Request, res: Response) => {
  try {
    const { moduleId } = req.params;
    let grades: any = await getObjects({
      where: { moduleId },
      relations: ['studentId'],
    }, Grades);
    grades = await Promise.all(grades.map(async (grade: Grades) => {
      const newGrade: ModuleGrade = grade;
      delete newGrade.studentId.password;
      delete newGrade.studentId.isAdministrator;
      delete newGrade.studentId.isTeacher;
      const userId = newGrade.studentId;
      newGrade.studentDetails = await getOneObject({
        select: ['fullname', 'matriculationNumber'],
        where: { userId },
      }, UserDetail);
      return newGrade;
    }));
    res.status(200).send(grades);
  } catch (_err) {
    res.sendStatus(500);
  }
};

/**
 * @async
 * Deletes a specific grade from the repsitory 'Grades'
 * Corresponding API-Call: {@link https://github.com/Software-Engineering-DHBW/noodle_backend/wiki/API#post-gradesdelete | POST /grades/delete}
 * @param {Request} req - Received request object
 * @param {Response} res - Received response object
 */
export const deleteGradeForStudent = async (req: Request, res: Response) => {
  try {
    const data: Grades = req.body;
    await deleteObjects(data, Grades);
    res.status(200).send('The grade has been deleted');
  } catch (_err) {
    res.status(500).send('The grade could not be deleted');
  }
};
