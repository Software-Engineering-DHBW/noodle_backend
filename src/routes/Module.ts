import { Request, Response } from 'express';
import {
  getConnection, getRepository, Not,
} from 'typeorm';
import {
  deleteObjects, getObjects, getOneObject, saveObject,
} from './Manager';
import Module from '../entity/Module';
import Course from '../entity/Course';
import User from '../entity/User';
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
  const teacherList: User[] = [];
  data.assignedTeacher.forEach(async (element) => {
    const teacher: any = await getOneObject({ where: { id: element } }, User);
    if (!teacher.isTeacher) {
      console.log(`Assigned User ${teacher.fullName} is not a teacher`);
    }
    teacherList.push(teacher);
  });
  console.log(teacherList);
  newModule.assignedTeacher = teacherList;
  if (data.submodule != null) {
    const moduleList: Module[] = [];
    data.submodule.forEach(async (element) => {
      const module: any = await getOneObject({ where: { id: element } }, Module);
      moduleList.push(module);
    });
    newModule.submodule = moduleList;
  } else {
    newModule.submodule = null;
  }
  newModule.assignedCourse = data.assignedCourse;
  return newModule;
};

/**
 * @async
 * Saves the create Module-Object inside the database.
 * No data is stored, if the object could not be stored,
 * in this case a response with HTTP-Status 403 will be formed.
 * Forms a response with HTTP-Code 200 if the object could be stored.
 * @param {Module} newModule - New Module to store
 * @param {Response} res - Response object for sending the response
 */
const saveNewModule = async (newModule: Module, res: Response): Promise<void> => {
  const queryRunner = getConnection().createQueryRunner();
  await queryRunner.startTransaction();
  try {
    await queryRunner.manager.save(newModule);
    await queryRunner.commitTransaction();
    res.sendStatus(200);
  } catch (_err) {
    console.log(_err);
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
export const registerModule = (req: Request, res: Response) => {
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
export const deleteModule = async (req: Request, res: Response) => {
  try {
    const { moduleId } = req.params;
    const module: any = await getOneObject({ where: { id: moduleId } }, Module);
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
export const addTeacher = async (req: Request, res: Response) => {
  try {
    const { moduleId } = req.params;
    const data: ChangeTeacher = req.body;
    if (data.teacher == null) {
      throw new Error();
    }
    const module: any = await getOneObject({ where: { id: moduleId }, relations: ['assignedTeacher'] }, Module);
    const allTeachers: any = await getObjects({ where: { isTeacher: true } }, User);
    const teachers = module.assignedTeacher;
    allTeachers.forEach((element, index) => {
      const indexData = data.teacher.indexOf(element.id);
      const indexTeacher = teachers.indexOf(element.id);
      if (indexData > -1 && indexTeacher === -1) {
        teachers.push(allTeachers[index]);
      }
    });
    module.assignedTeacher = teachers;
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
export const deleteTeacher = async (req: Request, res: Response) => {
  try {
    const { moduleId } = req.params;
    const data: ChangeTeacher = req.body;
    if (data.teacher == null) {
      throw new Error();
    }
    const module: any = await getOneObject({ where: { id: moduleId }, relations: ['assignedTeacher'] }, Module);
    const teacherList: User[] = [];
    const teachers = module.assignedTeacher;
    teachers.forEach((element, index) => {
      const indexData = data.teacher.indexOf(element.id);
      if (indexData === -1) {
        teacherList.push(teachers[index]);
      }
    });
    module.assignedTeacher = teacherList;
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
export const addCourse = async (req: Request, res: Response) => {
  try {
    const { moduleId } = req.params;
    const data: ChangeCourse = req.body;
    if (data.course == null) {
      throw new Error();
    }
    const module: any = await getOneObject({ where: { id: moduleId } }, Module);
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
export const removeCourse = async (req: Request, res: Response) => {
  try {
    const { moduleId } = req.params;
    const module: any = await getOneObject({ where: { id: moduleId } }, Module);
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
export const changeDescription = async (req: Request, res: Response) => {
  try {
    const { moduleId } = req.params;
    const data: ChangeString = req.body;
    const module: any = await getOneObject({ where: { id: moduleId } }, Module);
    module.description = data.description;
    await saveObject(module, Module);
    res.status(200).send('The Description has been changed');
  } catch (_err) {
    res.status(500).send('Description could not be changed');
  }
};

/**
 * @exports
 * @async
 * Adds a Submodule to a Module with the data given in the HTTP-Request
 * @param {Request} req - Holds the data from the HTTP-Request
 * @param {Response} res- Used to form the response
 */
export const addSubmodule = async (req: Request, res: Response) => {
  try {
    const { moduleId } = req.params;
    const data: ChangeSubmodule = req.body;
    if (data.submodule == null) {
      throw new Error();
    }
    const module: any = await getOneObject({ where: { id: moduleId } }, Module);
    const submodules: any = await getObjects({ where: { seniormodule: moduleId } }, Module);
    const submodulesOtherModules: any = await getObjects({ where: { seniormodule: Not(moduleId) } }, Module);
    const submodulesNull: any = await getObjects({ where: { seniormodule: null } }, Module);
    const submodulesAll = submodulesOtherModules.concat(submodulesNull);
    submodulesAll.forEach((element, index) => {
      const indexData = data.submodule.indexOf(element.id);
      if (indexData > -1) {
        submodules.push(submodulesAll[index]);
      }
    });
    module.submodule = submodules;
    await saveObject(module, Module);
    res.status(200).send('The Submodule have been added');
  } catch (_err) {
    console.log(_err);
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
export const deleteSubmodule = async (req: Request, res: Response) => {
  try {
    const { moduleId } = req.params;
    const data: ChangeSubmodule = req.body;
    if (data.submodule == null) {
      throw new Error();
    }
    const module: any = await getOneObject({ where: { id: moduleId } }, Module);
    const submodules: any = await getObjects({ where: { seniormodule: moduleId } }, Module);
    const submodulesList: Module[] = [];
    submodules.forEach((element, index) => {
      const indexData = data.submodule.indexOf(element.id);
      if (indexData === -1) {
        submodulesList.push(submodules[index]);
      }
    });
    module.submodule = submodulesList;
    await saveObject(module, Module);
    res.status(200).send('The Submodule have been removed');
  } catch (_err) {
    console.log(_err);
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
export const changeName = async (req: Request, res: Response) => {
  try {
    const { moduleId } = req.params;
    const data: ChangeString = req.body;
    if (data.name == null) {
      throw new Error();
    }
    const module: any = await getOneObject({ where: { id: moduleId } }, Module);
    module.name = data.name;
    await saveObject(module, Module);
    res.status(200).send('The Name has been changed');
  } catch (_err) {
    res.status(500).send('Name could not be changed');
  }
};
/**
 * @exports
 * @async
 * Returns the informations of a module
 * @param {Request} req - Holds the data from the HTTP-Request
 * @param {Response} req - Used to form the response
 */
export const selectModule = async (req: Request, res: Response) => {
  try {
    const { moduleId } = req.params;
    const module: any = await getOneObject({ where: { id: moduleId }, relations: ['assignedTeacher', 'submodule'] }, Module);
    res.status(200).send(module);
  } catch (_err) {
    console.log(_err);
    res.status(500).send('Could not find the module');
  }
};
