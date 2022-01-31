import { Request, Respone } from 'express';
import { getConnection } from 'typeorm';
import Module from '../entity/Module';
import Course from '../entity/Course';
import User from '../entity/User';

/**
 * Representation of the incoming data of a new module
 * @interface
 */
interface RegisterModule {
    description: string;
    assignedTeacher: User;
    assignedCourse: Course;
    submodule: Module[];
}

/**
 * Creates a new Module with the given data
 * @param {RegisterModule} data - Data of the new module
 * @returns {Module}
 */
const createModule = (data: RegisterModule): Module => {
  const newModule = new Module();
  newModule.description = data.description;
  newModule.assignedTeacher = data.assignedTeacher;
  newModule.submodule = data.submodule;
  return newModule;
};

/**
 * Saves the create Module-Object inside the database.
 * No data is stored, if the object could not be stored,
 * in this case a response with HTTP-Status 403 will be formed.
 * Forms a response with HTTP-Code 200 if the object could be stored.
 * @param {Module} newModule - New Module to store
 * @param {Respone} res - Response object for sending the response
 */
const saveNewModule = async (newModule: Module, res: Respone): Promise<void> => {
  const queryRunner = getConnection().createQueryRunner();
  await queryRunner.startTransaction();
  try {
    await queryRunner.manager.save(newModule);
    await queryRunner.commitTransaction();

    res.sendStatus(200);
  } catch (_err) {
    await queryRunner.rollbackTransaction();
    res.sendStatus(403);
  }
};
/**
 * @exports
 * Registers a new Module with the data given in the HTTP-Request
 * @param {Request} req - Holds the data from the HTTP-Request
 * @param {Response} res- Used to form the response
 */
export const registerModule = (req: Request, res: Respone) => {
  const data: RegisterModule = req.body;
  const newModule: Module = createModule(data);
  saveNewModule(newModule, res);
};
