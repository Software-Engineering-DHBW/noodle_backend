import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Grades from '../entity/Grades';
import Module from '../entity/Module';
import { getObjects, deleteObjects } from './Manager';

/**
 * @interface
 * Interface for the request data when deleting a grade
 */
interface DeleteGrade {
  id?: number;
  moduleId: number;
  studentId: number;
}

/**
 * exports
 * async
 * Insert or update a grade
 * @param {Request} req - Received request object
 * @param {Response} res - Received response object
 */
export const insertGradeForStudent = async (req: Request, res: Response) => {
  try {
    const data: Grades = req.body;
    const gradesRepository = getRepository(Grades);
    gradesRepository.save(data);
    res.status(200).send('The grade has been saved');
  } catch (_err) {
    res.status(500).send('The grade has not been saved');
  }
};

/**
 * @exports
 * @async
 * Gets the grades for a specific student from the repository 'Grades'
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
    res.status(500);
  }
};

/**
 * @exports
 * @async
 * Deletes a specific grade from the repsitory 'Grades'
 * @param {Request} req - Received request object
 * @param {Response} res - Received response object
 */
export const deleteGradeForStudent = async (req: Request, res: Response) => {
  try {
    const data: Grades = req.body;
    deleteObjects(data, Grades);
    res.status(200).send('The grade has been deleted');
  } catch (_err) {
    res.status(500).send('The grade could not be deleted');
  }
};
