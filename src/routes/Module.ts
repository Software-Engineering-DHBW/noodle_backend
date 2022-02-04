import { Request, Respone } from 'express';
import { getConnection } from 'typeorm';
import {
  deleteObjects, getObjects, getOneObject, saveObject,
} from './Manager';
import Module from '../entity/Module';
import Course from '../entity/Course';
import User from '../entity/User';
import File from '../entity/File';
import { addItem } from './ModuleItem';

/**
 * Representation of the incoming data for adding a module
 * @interface
 */
interface GeneralModule {
  name: string;
  description?: string;
  assignedTeacher: User[];
  assignedCourse?: Course;
  submodule: Module[];
}
/**
 * Representation of the incoming data of a moduleItem
 * @interface
 */
interface ModuleItem {
  id?: number;
  moduleId?: number;
  content?: string;
  webLink?: string;
  downloadableFile?: File;
  hasFileUpload: boolean;
  uploadedFiles?: File[];
  isVisible: boolean;
}
/**
 * Representation of the incoming data for changing the name or description of a module
 * @interface
 */
interface ChangeString {
  name?: string;
  description?: string;
}
/**
 * Representation of the incoming data for changing the submodule of a module
 * @interface
 */
interface ChangeSubmodule {
  submodule: Module[];
}
/**
 * Representation of the incoming data for changing the course of a module
 * @interface
 */
 interface ChangeCourse {
  course: Course;
}
/**
 * Representation of the incoming data for changing the teacher of a module
 * @interface
 */
 interface ChangeTeacher {
  teacher: User[];
}

/**
 * Creates a new Module with the given data
 * @param {GeneralModule} data - Data of the new module
 * @returns {Module}
 */
const createModule = (data: GeneralModule): Module => {
  const newModule = new Module();
  newModule.name = data.name;
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
 * @exports
 * Registers a new Module with the data given in the HTTP-Request
 * @param {Request} req - Holds the data from the HTTP-Request
 * @param {Response} res- Used to form the response
 */
export const registerModule = (req: Request, res: Respone) => {
  const data: GeneralModule = req.body;
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
    const { moduleId } = req.params;
    const module: any = getOneObject({ where: { id: moduleId } }, Module);
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
    const { moduleId } = req.params;
    const data: ChangeTeacher = req.body;
    if (data.teacher == null) {
      throw new Error();
    }
    const module: any = getOneObject({ where: { id: moduleId } }, Module);
    const teacher: User[] = module.assignedTeacher;
    teacher.concat(data.teacher);
    module.assignedTeacher = teacher;
    await saveObject(module, Module);
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
    const { moduleId } = req.params;
    const data: ChangeTeacher = req.body;
    if (data.teacher == null) {
      throw new Error();
    }
    const module: any = getOneObject({ where: { id: moduleId } }, Module);
    const teacher: User[] = module.assignedTeacher;
    data.teacher.forEach((element) => {
      const index = teacher.indexOf(element);
      if (index > -1) {
        teacher.splice(index, 1);
      }
    });
    module.assignedTeacher = teacher;
    await saveObject(module, Module);
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
  try {
    const { moduleId } = req.params;
    const data: ChangeCourse = req.body;
    if (data.course == null) {
      throw new Error();
    }
    const module: any = getOneObject({ where: { id: moduleId } }, Module);
    module.assignedCourse = data.course;
    await saveObject(module, Module);
    res.status(200).send('The Course has been added');
  } catch (_err) {
    res.status(500).send('Course could not be added');
  }
};

/**
 * @exports
 * @async
 * Deletes a Course from a Module with the data given in the HTTP-Request
 * @param {Request} req - Holds the data from the HTTP-Request
 * @param {Response} res- Used to form the response
 */
export const removeCourse = async (req: Request, res: Respone) => {
  try {
    const { moduleId } = req.params;
    const module: any = getOneObject({ where: { id: moduleId } }, Module);
    module.assignedCourse = null;
    await saveObject(module, Module);
    res.status(200).send('The Course has been deleted');
  } catch (_err) {
    res.status(500).send('Course could not be deleted');
  }
};

/**
 * @exports
 * @async
 * Changes the description of a Module with the data given in the HTTP-Request
 * @param {Request} req - Holds the data from the HTTP-Request
 * @param {Response} res- Used to form the response
 */
export const changeDescription = async (req: Request, res: Respone) => {
  try {
    const { moduleId } = req.params;
    const data: ChangeString = req.body;
    const module: any = getOneObject({ where: { id: moduleId } }, Module);
    module.description = data.description;
    await saveObject(module, Module);
    res.status(200).send('The Description has been changed');
  } catch (_err) {
    res.send(500).send('Description could not be changed');
  }
};

/**
 * @exports
 * @async
 * Adds a Submodule to a Module with the data given in the HTTP-Request
 * @param {Request} req - Holds the data from the HTTP-Request
 * @param {Response} res- Used to form the response
 */
export const addSubmodule = async (req: Request, res: Respone) => {
  try {
    const { moduleId } = req.params;
    const data: ChangeSubmodule = req.body;
    if (data.submodule == null) {
      throw new Error();
    }
    const module: any = getOneObject({ where: { id: moduleId } }, Module);
    const { submodule } = module;
    submodule.concat(data.submodule);
    module.submodule = submodule;
    await saveObject(module, Module);
    res.status(200).send('The Submodule have been added');
  } catch (_err) {
    res.status(500).send('Submodule could not be added');
  }
};

/**
 * @exports
 * @async
 * Deletes a Submodule from a Module with the data given in the HTTP-Request
 * @param {Request} req - Holds the data from the HTTP-Request
 * @param {Response} res- Used to form the response
 */
export const deleteSubmodule = async (req: Request, res: Respone) => {
  try {
    const { moduleId } = req.params;
    const data: ChangeSubmodule = req.body;
    if (data.submodule == null) {
      throw new Error();
    }
    const module: any = getOneObject({ where: { id: moduleId } }, Module);
    const { submodule } = module;
    data.submodule.forEach((element) => {
      const index = submodule.indexOf(element);
      if (index > -1) {
        submodule.splice(index, 1);
      }
    });
    module.submodule = submodule;
    await saveObject(module, Module);
    res.status(200).send('The Submodule have been removed');
  } catch (_err) {
    res.status(500).send('Submodule could not be removed');
  }
};
/**
 * @exports
 * @async
 * Changes the name of a Module with the data given in the HTTP-Request
 * @param {Request} req - Holds the data from the HTTP-Request
 * @param {Response} res- Used to form the response
 */
export const changeName = async (req: Request, res: Respone) => {
  try {
    const { moduleId } = req.params;
    const data: ChangeString = req.body;
    if (data.name == null) {
      throw new Error();
    }
    const module: any = getOneObject({ where: { id: moduleId } }, Module);
    module.name = data.name;
    await saveObject(module, Module);
    res.status(200).send('The Name has been changed');
  } catch (_err) {
    res.send(500).send('Name could not be changed');
  }
};
/**
 * @exports
 * @async
 * Returns the informations of a module
 * @param {Request} req - Holds the data from the HTTP-Request
 * @param {Respone} req - Used to form the response
 */
export const selectModule = async (req: Request, res: Respone) => {
  try {
    const { moduleId } = req.params;
    const module = await getObjects({
      select: ['name', 'description', 'assignedTeacher', 'assignedCourse', 'submodule'],
      where: { id: moduleId },
    }, Module);
    res.status(200).send(module);
  } catch (_err) {
    res.status(500).send('Could not find the module');
  }
};

export const addModuleItem = async (req: Request, res: Respone) => {
  const data: ModuleItem = req.body;
  data.moduleId = req.params.moduleId;
  addItem(data, res);
};
