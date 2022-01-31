import { Request, Respone } from "express";
import { Module } from "../entity/Module";
import { Course } from "../entity/Course";
import { User } from "../entity/User";
import { getConnection } from "typeorm";

/**
 * Representation of the incoming data of a new module
 * @interface
 */
interface RegisterModule {
    description: string;
    assigned_teacher: User;
    assigned_course: Course;
    submodule: Module[];
}

/**
 * @exports
 * Registers a new Module with the data given in the HTTP-Request
 * @param {Request} req - Holds the data from the HTTP-Request
 * @param {Response} res- Used to form the response
 */
export const register_module = (req: Request, res: Respone) => {
    const data: RegisterModule = req.body;
    const new_module: Module = create_module(data);
    save_new_module(new_module, res);
}

/**
 * Creates a new Module with the given data
 * @param {RegisterModule} data - Data of the new module
 * @returns {Module}
 */
const create_module = (data: RegisterModule): Module => {
    const new_module = new Module();
    new_module.description = data.description;
    new_module.assigned_teacher = data.assigned_teacher;
    new_module.submodule = data.submodule;
    return new_module;
}

/**
 * Saves the create Module-Object inside the database.
 * No data is stored, if the object could not be stored, in this case a response with HTTP-Status 403 will be formed.
 * Forms a response with HTTP-Code 200 if the object could be stored.
 * @param {Module} new_module - New Module to store
 * @param {Respone} res - Response object for sending the response
 */
const save_new_module = async (new_module: Module, res: Respone): Promise<void> => {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();
    try {
        await queryRunner.manager.save(new_module);
        await queryRunner.commitTransaction();

        res.sendStatus(200);
    } catch (_err) {
        await queryRunner.rollbackTransaction();
        res.sendStatus(403);
    }
}
