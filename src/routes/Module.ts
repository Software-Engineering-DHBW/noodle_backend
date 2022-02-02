import { Request, Respone } from 'express';
import { getConnection, getRepository, Repository } from 'typeorm';
import { deleteObjects, getOneObject, saveObject } from './Manager';
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
 * Representation of the incoming data of a module Request
 * @interface
 */
interface GeneralModule {
  id?: number;
  name?: string;
  description?: string;
  assignedTeacher?: User[];
  assignedCourse?: Course;
  submodule?: Module[];
  seniormodule?: Module;
}

/**
 * Return the module with the given ID
 * @param {GeneralModule} data - Data from the Requst
 * @returns {Module}
 */
const getModule = (data: GeneralModule): Module => {
  if (data.id == null) {
    throw new Error();
  }
  const module: any = getOneObject({ where: { id: data.id } }, Module);
  return module;
};
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
  try {
    const data: GeneralModule = req.body;
    const module: Module = getModule(data);
    await deleteObjects(module, Module);
    res.status(200).send('The Module has been deleted');
  } catch (_err) {
    res.status(500).send('Module could not be deleted');
  }
};

/**
 * @exports
 * @async
 * Adds a Teacher to a Module with the data given in the HTTP-Request
 * @param {Request} req - Holds the data from the HTTP-Request
 * @param {Response} res- Used to form the response
 */
export const addTeacher = async (req: Request, res: Respone) => {
  try {
    const data: GeneralModule = req.body;
    const module: Module = getModule(data);
    const teacher: User[] = module.assignedTeacher;
    teacher.concat(data.assignedTeacher);
    module.assignedTeacher = teacher;
    await saveObject(module);
    res.status(200).send('The Teachers have been added');
  } catch (_err) {
    res.status(500).send('Teachers could not be added');
  }
};

/**
 * @exports
 * @async
 * Deletes a Teacher from a Module with the data given in the HTTP-Request
 * @param {Request} req - Holds the data from the HTTP-Request
 * @param {Response} res- Used to form the response
 */
export const deleteTeacher = async (req: Request, res: Respone) => {
  try {
    const data: GeneralModule = req.body;
    const module: Module = getModule(data);
    const teacher: User[] = module.assignedTeacher;
    data.assignedTeacher.forEach((element) => {
      const index = teacher.indexOf(element);
      if (index > -1) {
        teacher.splice(index, 1);
      }
    });
    module.assignedTeacher = teacher;
    await saveObject(module);
    res.status(200).send('The Teachers have been removed');
  } catch (_err) {
    res.status(500).send('Teachers could not be removed');
  }
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
