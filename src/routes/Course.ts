import { Request, Response } from 'express';
import { getConnection, getRepository, Repository } from 'typeorm';
import Course from '../entity/Course';
import User from '../entity/User';
import Module from '../entity/Module';

/**
 * Representation of the incoming data of a new file
 * @interface
 */
interface RegisterCourse {
  name: string;
  students: User[];
}
/**
 * Representation of the incoming data for removing a course
 * @interface
 */
interface DeleteCourse {
  name: string;
}
/**
 * Representation of the incoming data for adding or removing a student
 * @interface
 */
interface ChangeStudent extends DeleteCourse {
  students: User[];
}

/**
 * Reprenstation of the incoming data for changing a course
 * @interface
 */
interface ChangeCourse extends DeleteCourse {
  newName: string;
}
/**
 * Creates a new Course with the given data
 * @param {RegisterCourse} data - Data of the new course
 * @returns {Course}
 */
const createCourse = (data: RegisterCourse): Course => {
  const newCourse = new Course();
  newCourse.name = data.name;
  newCourse.students = data.students;
  return newCourse;
};
/**
 * @async
 * Saves the create Course-Object inside the database.
 * No data is stored, if the object could not be stored,
 * in this case a response with HTTP-Status 403 will be formed.
 * Forms a response with HTTP-Code 200 if the object could be stored.
 * @param {Course} newCourse - New Course to store
 * @param {Response} res - Response object for sending the response
 */
const saveNewCourse = async (newCourse: Course, res: Response): Promise<void> => {
  const queryRunner = getConnection().createQueryRunner();
  await queryRunner.startTransaction();
  try {
    await queryRunner.manager.save(newCourse);
    await queryRunner.commitTransaction();
    res.sendStatus(200);
  } catch (_err) {
    await queryRunner.rollbackTransaction();
    res.sendStatus(403);
  }
};

/**
 * @async
 * Find the Repository 'Course' and all courses with the given name
 * @param {string} name - Given name from the request
 * @returns {Promise<[Course, Repository<Course>]>}
 */
const getCourseAndRepo = async (name: string): Promise<[Course, Repository<Course>]> => {
  if (name === undefined || name === null) {
    throw new Error();
  }
  const courseRepository = getRepository(Course);
  const course: Course = await courseRepository.findOneOrFail({ where: { name } });
  return [course, courseRepository];
};

/**
 * @exports
 * Registers a new Course with the data given by the HTTP-Request
 * @param {Request} req - Holds the data from the HTTP-Request
 * @param {Response} res - Used to form the response
 */
export const registerCourse = (req: Request, res: Response) => {
  const data: RegisterCourse = req.body;
  const newCourse: Course = createCourse(data);
  saveNewCourse(newCourse, res);
};

/**
 * @exports
 * @async
 * Adds a new student to a course with the data given by the HTTP-Request
 * @param {Request} req - Holds the data from the HTTP-Request
 * @param {Response} res - Used to form the response
 */
export const addStudent = async (req: Request, res: Response) => {
  try {
    const data: ChangeStudent = req.body;
    const [course, courseRepository] = await getCourseAndRepo(data.name);
    const { students } = course;
    students.concat(data.students);
    await courseRepository.update({ id: course.id }, { students });
    res.status(200).send('The Students have been added');
  } catch (_err) {
    res.status(500).send('Students could not be added');
  }
};

/**
 * @exports
 * @async
 * Reomves a student to a course with the data given by the HTTP-Request
 * @param {Request} req - Holds the data from the HTTP-Request
 * @param {Response} res - Used to form the response
 */
export const removeStudent = async (req: Request, res: Response) => {
  try {
    const data: ChangeStudent = req.body;
    const [course, courseRepository] = await getCourseAndRepo(data.name);
    const { students } = course;
    data.students.forEach((element) => {
      const index = students.indexOf(element);
      if (index > -1) {
        students.splice(index, 1);
      }
    });
    await courseRepository.update({ id: course.id }, { students });
    res.status(200).send('The Students have been removed');
  } catch (_err) {
    res.status(500).send('Students could not be removed');
  }
};

/**
 * @exports
 * @async
 * Returns the informations to a course with the data given by the HTTP-Request
 * @param {Request} req - Holds the data from the HTTP-Request
 * @param {Response} res - Used to form the response
 */
export const selectCourse = async (req: Request, res: Response) => {
  try {
    const data: DeleteCourse = req.body;
    const [course] = await getCourseAndRepo(data.name);
    res.status(200).json({
      ID: course.id,
      Name: course.name,
      Students: course.students,
    });
  } catch (_err) {
    res.status(500).send('Could not find the course');
  }
};

/**
 * @exports
 * @async
 * Updates a course with the data given by the HTTP-Request
 * @param {Request} req - Holds the data from the HTTP-Request
 * @param {Response} res - Used to form the response
 */
export const changeCourse = async (req: Request, res: Response) => {
  try {
    const data: ChangeCourse = req.body;
    const [course, courseRepository] = await getCourseAndRepo(data.name);
    await courseRepository.update({ id: course.id }, { name: data.newName });
    res.status(200).send('The Course has been updated');
  } catch (_err) {
    res.status(500).send('Course could not be updated');
  }
};

/**
 * @exports
 * @async
 * Updates a course with the data given by the HTTP-Request
 * @param {Request} req - Holds the data from the HTTP-Request
 * @param {Response} res - Used to form the response
 */
export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const data: DeleteCourse = req.body;
    const [course, courseRepository] = await getCourseAndRepo(data.name);
    await courseRepository.delete(course);
    res.status(200).send('The Course has been deleted');
  } catch (_err) {
    res.status(500).send('Course could not be deleted');
  }
};
