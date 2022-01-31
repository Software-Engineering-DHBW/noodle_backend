import { Request, Response } from "express";
import { getConnection } from "typeorm";
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
 * @exports
 * Registers a new Course with the data given by the HTTP-Request
 * @param {Request} req - Holds the data from the HTTP-Request
 * @param {Response} res - Used to form the response
 */
export const register_course = (req: Request, res: Response) => {
    const data: RegisterCourse = req.body;
    const new_course: Course = create_course(data);
    save_new_course(new_course, res);
}

/**
 * Creates a new Course with the given data
 * @param {RegisterCourse} data - Data of the new course
 * @returns {Course}
 */
const create_course = (data: RegisterCourse): Course => {
    const new_course = new Course();
    new_course.name = data.name;
    new_course.students = data.students;
    return new_course;
}

/**
 * Saves the create Course-Object inside the database.
 * No data is stored, if the object could not be stored, in this case a response with HTTP-Status 403 will be formed.
 * Forms a response with HTTP-Code 200 if the object could be stored.
 * @param {Course} new_course - New Course to store
 * @param {Response} res - Response object for sending the response
 */
const save_new_course = async (new_course: Course, res: Response): Promise<void> => {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();
    try {
        await queryRunner.manager.save(new_course);
        await queryRunner.commitTransaction();
        res.sendStatus(200);
    } catch (_err) {
        await queryRunner.rollbackTransaction();
        res.sendStatus(403);
    }
}
