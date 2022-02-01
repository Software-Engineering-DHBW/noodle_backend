import { Request, Respone } from 'express';
import { getConnection, getRepository, Repository } from 'typeorm';
import Module from '../entity/Module';
import Course from '../entity/Course';
import User from '../entity/User';

/**
 * Representation of the incoming data of a new module
 * @interface
 */
interface RegisterModule {
  description: string;
  assignedTeacher: User[];
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
 * @async
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
 * @async
 * Find the Repository 'Module' and all modules with the given name
 * @param {string} name - Given name from the request
 * @returns {Promise<[Module, Repository<Module>]>}
 */
const getModuleAndRepo = async (name: string): Promise<[Module, Repository<Module>]> => {
  if (name === undefined || name === null) {
    throw new Error();
  }
  const moduleRepository = getRepository(Module);
  const module: Module = await moduleRepository.findOneOrFail({ where: { name } });
  return [module, moduleRepository];
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

/**
 * @exports
 * @async
 * Deletes a Module with the data given in the HTTP-Request
 * @param {Request} req - Holds the data from the HTTP-Request
 * @param {Response} res- Used to form the response
 */
export const deleteModule = async (req: Request, res: Respone) => {
  const data = req.body;
  const [module, moduleRepository] = getModuleAndRepo(data.name);
};

/**
 * @exports
 * @async
 * Adds a Teacher to a Module with the data given in the HTTP-Request
 * @param {Request} req - Holds the data from the HTTP-Request
 * @param {Response} res- Used to form the response
 */
export const addTeacher = async (req: Request, res: Respone) => {

};

/**
 * @exports
 * @async
 * Deletes a Teacher from a Module with the data given in the HTTP-Request
 * @param {Request} req - Holds the data from the HTTP-Request
 * @param {Response} res- Used to form the response
 */
export const deleteTeacher = async (req: Request, res: Respone) => {

};

/**
 * @exports
 * @async
 * Adds a Course to a Module with the data given in the HTTP-Request
 * @param {Request} req - Holds the data from the HTTP-Request
 * @param {Response} res- Used to form the response
 */
export const addCourse = async (req: Request, res: Respone) => {

};

/**
 * @exports
 * @async
 * Deletes a Course from a Module with the data given in the HTTP-Request
 * @param {Request} req - Holds the data from the HTTP-Request
 * @param {Response} res- Used to form the response
 */
export const deleteCourse = async (req: Request, res: Respone) => {

};

/**
 * @exports
 * @async
 * Changes the description of a Module with the data given in the HTTP-Request
 * @param {Request} req - Holds the data from the HTTP-Request
 * @param {Response} res- Used to form the response
 */
export const changeDescription = async (req: Request, res: Respone) => {

};

/**
 * @exports
 * @async
 * Adds a Submodule to a Module with the data given in the HTTP-Request
 * @param {Request} req - Holds the data from the HTTP-Request
 * @param {Response} res- Used to form the response
 */
export const addSubmodule = async (req: Request, res: Respone) => {

};

/**
 * @exports
 * @async
 * Deletes a Submodule from a Module with the data given in the HTTP-Request
 * @param {Request} req - Holds the data from the HTTP-Request
 * @param {Response} res- Used to form the response
 */
export const deleteSubmodule = async (req: Request, res: Respone) => {

};
