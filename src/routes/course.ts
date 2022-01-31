import { Request, Response } from "express";
import { getConnection, getRepository } from "typeorm";
import { Course } from "../entity/Course";
import { User } from "../entity/User";

/**
 * Representation of the incoming data of a new file
 * @interface
 */
interface RegisterCourse {
    name: string;
    students: User[];
}

/**
 * Representation of the incoming data for adding or removing a student
 * @interface
 */
interface ChangeStudent extends DeleteCourse {
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
 * @exports
 * Registers a new Course with the data given by the HTTP-Request
 * @param {Request} req - Holds the data from the HTTP-Request
 * @param {Response} res - Used to form the response
 */
export const registerCourse = (req: Request, res: Response) => {
    const data: RegisterCourse = req.body;
    const new_course: Course = createCourse(data);
    saveNewCourse(new_course, res);
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
}

/**
 * Saves the create Course-Object inside the database.
 * No data is stored, if the object could not be stored, in this case a response with HTTP-Status 403 will be formed.
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
}

/**
 * @exports
 * Adds a new student to a course with the data given by the HTTP-Request
 * @param {Request} req - Holds the data from the HTTP-Request
 * @param {Response} res - Used to form the response
 */
export const addStudent = async (req: Request, res: Response) => {
    try {
        const data: ChangeStudent = req.body;
        if (data.name === undefined || data.name === null) {
            throw new Error();
        }
        const courseRepository = getRepository(Course);
        const course: Course = await courseRepository.findOneOrFail({ where: { name: data.name } })
        const newStudents: User[] = course.students;
        newStudents.concat(data.students);
        await courseRepository.update({ id: course.id }, { students: newStudents })
        res.status(200).send("The Students have been added")
    } catch (_err) {
        res.status(500).send("Students could not be added")
    }

}
