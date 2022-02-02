import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import { deleteObjects, getOneObject, saveObject } from './Manager';
import Course from '../entity/Course';
import User from '../entity/User';

/**
 * Representation of the incoming data of a course Request
 * @interface
 */
interface GeneralCourse {
  id?: number;
  name?: string;
  students?: User[];
}
/**
 * Representation of the incoming data for changing a course
 * @interface
 */
interface ChangeCourse extends GeneralCourse {
  newName: string;
}

/**
 * Return the course with the given ID or name
 * @param {GeneralCourse} data - Data from the Requst
 * @returns {Course}
 */
const getCourse = (data: GeneralCourse): Course => {
  if (data.id == null && data.name == null) {
    throw new Error();
  }
  const course: any = data.id
    ? getOneObject({ where: { id: data.id } }, Course)
    : getOneObject({ where: { name: data.name } }, Course);
  return course;
};
/**
 * Creates a new Course with the given data
 * @param {GeneralCourse} data - Data of the new course
 * @returns {Course}
 */
const createCourse = (data: GeneralCourse): Course => {
  const newCourse = new Course();
  if (data.name == null || data.students == null) {
    throw new Error();
  }
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
 * @exports
 * Registers a new Course with the data given by the HTTP-Request
 * @param {Request} req - Holds the data from the HTTP-Request
 * @param {Response} res - Used to form the response
 */
export const registerCourse = (req: Request, res: Response) => {
  const data: GeneralCourse = req.body;
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
    const data: GeneralCourse = req.body;
    const course: Course = getCourse(data);
    const { students } = course;
    students.concat(data.students);
    course.students = students;
    await saveObject(course, Course);
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
    const data: GeneralCourse = req.body;
    const course: Course = getCourse(data);
    const { students } = course;
    data.students.forEach((element) => {
      const index = students.indexOf(element);
      if (index > -1) {
        students.splice(index, 1);
      }
    });
    course.students = students;
    await saveObject(course, Course);
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
    const data: GeneralCourse = req.body;
    const course: Course = getCourse(data);
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
    const course: Course = getCourse(data);
    course.name = data.newName;
    await saveObject(course, Course);
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
    const data: GeneralCourse = req.body;
    const course: Course = getCourse(data);
    await deleteObjects(course, Course);
    res.status(200).send('The Course has been deleted');
  } catch (_err) {
    res.status(500).send('Course could not be deleted');
  }
};
