import { Request, Response } from 'express';
import { getConnection, Not } from 'typeorm';
import {
  deleteObjects, getOneObject, saveObject, getObjects,
} from './Manager';
import Course from '../entity/Course';
import User from '../entity/User';

/**
 * Representation of the incoming data for adding a course
 * @interface
 */
interface GeneralCourse {
  name?: string;
  students?: User[];
}
/**
 * Representation of the incoming data for changing the students of a course
 * @interface
 */
interface ChangeStudents {
  students: User[];
}
/**
 * Representation of the incoming data for changing the name of a course
 * @interface
 */
interface ChangeCourse {
  newName: string;
}

/**
 * Creates a new Course with the given data
 * @param {GeneralCourse} data - Data of the new course
 * @returns {Course}
 */
const createCourse = async (data: GeneralCourse): Promise<Course> => {
  const newCourse = new Course();
  if (data.name == null || data.students == null) {
    throw new Error();
  }
  newCourse.name = data.name;
  const studentList: User[] = [];
  data.students.forEach(async (element) => {
    const student: any = await getOneObject({ where: { id: element } }, User);
    if (student.isAdministrator || student.isTeacher) {
      console.log(`assigned student ${student.fullName} is teacher or admin`);
    }
    studentList.push(student);
  });
  newCourse.students = studentList;
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
 * @async
 * Registers a new Course with the data given by the HTTP-Request
 * @param {Request} req - Holds the data from the HTTP-Request
 * @param {Response} res - Used to form the response
 */
export const registerCourse = async (req: Request, res: Response) => {
  const data: GeneralCourse = req.body;
  const newCourse: Course = await createCourse(data);
  await saveNewCourse(newCourse, res);
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
    const { courseId } = req.params;
    const course: any = await getOneObject({ where: { id: courseId } }, Course);
    const students: any = await getObjects({ where: { course: courseId } }, User);
    const otherStudents: any = await getObjects({ where: [{ course: Not(courseId) }, { course: null }] }, User);
    const data: ChangeStudents = req.body;
    otherStudents.forEach((element, index) => {
      const indexData = data.students.indexOf(element.id);
      if (indexData > -1) {
        students.push(otherStudents[index]);
      }
    });
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
export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const course: any = await getOneObject({ where: { id: courseId } }, Course);
    const students: any = await getObjects({ where: { course: courseId } }, User);
    const data: ChangeStudents = req.body;
    const studentList: User[] = [];
    students.forEach((element, index) => {
      const indexData = data.students.indexOf(element.id);
      if (indexData === -1) {
        studentList.push(students[index]);
      }
    });
    course.students = studentList;
    await saveObject(course, Course);
    res.status(200).send('The Students have been deleted');
  } catch (_err) {
    res.status(500).send('Students could not be deleted');
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
    const { courseId } = req.params;
    const course: any = await getObjects({
      select: ['name', 'students'],
      where: { courseId },
    }, Course);
    res.status(200).send(course);
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
    const { courseId } = req.params;
    const course: any = await getOneObject({ where: { id: courseId } }, Course);
    const data: ChangeCourse = req.body;
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
    const { courseId } = req.params;
    const course: any = await getOneObject({ where: { id: courseId } }, Course);
    await deleteObjects(course, Course);
    res.status(200).send('The Course has been deleted');
  } catch (_err) {
    res.status(500).send('Course could not be deleted');
  }
};
