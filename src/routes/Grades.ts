import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Grades from '../entity/Grades';
import Module from '../entity/Module';

/**
 * @interface
 * Interface for the request data when deleting a grade
 */
interface DeleteGrade {
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
 * Gets the grades for a specific student from the entity 'Grades'
 * @param {Request} req - Received request object
 * @param {Response} res - Received response object
 */
export const getGradesForStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const gradesRepository = getRepository(Grades);
    const grades: Grades[] = await gradesRepository.find({
      select: ['grade', 'weight'],
      where: { studentId },
      relations: ['moduleId'],
    });
    res.status(200).send(grades);
  } catch (_err) {
    res.status(500);
  }
};
