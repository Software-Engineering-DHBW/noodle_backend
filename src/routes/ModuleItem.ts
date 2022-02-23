import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import File from '../entity/File';
import ModuleItem from '../entity/ModuleItem';
import Module from '../entity/Module';
import {
  deleteObjects, getObjects, getOneObject, saveObject,
} from './Manager';
import { registerFile, RegisterFile } from './File';

/**
 * Representation of the incoming data of a moduleItem
 * @interface
 */
interface RegisterModuleItem {
  moduleId?: Module;
  content?: string;
  webLink?: string;
  hasFileUpload?: boolean;
  downloadableFile?: File;
  isVisible?: boolean;
  dueDate?: string;
}
/**
 * Representation of the incoming data of a moduleItem
 * @interface
 */
interface ChangeModuleItem {
  content?: string;
  webLink?: string;
  hasFileUpload?: boolean;
  isVisible?: boolean;
  dueDate?: string;
}

interface DeleteUploadedFile {
  fileId: number;
}

/**
 * Creates a new ModuleItem with the given data
 * @param {GeneralModule} data - Data of the new module
 * @returns {Module}
 */
const createModuleItem = (data: RegisterModuleItem): ModuleItem => {
  const newModuleItem = new ModuleItem();
  newModuleItem.moduleId = data.moduleId;
  newModuleItem.content = data.content;
  newModuleItem.webLink = data.webLink;
  newModuleItem.hasFileUpload = data.hasFileUpload;
  newModuleItem.isVisible = data.isVisible;
  newModuleItem.dueDate = new Date(data.dueDate);
  return newModuleItem;
};
/**
 * @async
 * Saves the create ModuleItem- and File-Object inside the database.
 * No data is stored, if one of the objects could not be stored,
 * in this case a response with HTTP-Status 403 will be formed.
 * Forms a response with HTTP-Code 200 if the objects could be stored.
 * @param {ModuleItem} newModuleItem - New ModuleItem to store
 * @param {Response} res - Response object for sending the response
 * @param {File} newFile - New File to store
 */
const saveNewModuleItem = async (newModuleItem: ModuleItem, res: Response) => {
  const queryRunner = getConnection().createQueryRunner();
  await queryRunner.startTransaction();
  try {
    await queryRunner.manager.save(newModuleItem);
    await queryRunner.commitTransaction();
    res.sendStatus(200);
  } catch (_err) {
    await queryRunner.rollbackTransaction();
    res.sendStatus(403);
  }
};

export const registerModuleItem = async (req: Request, res: Response) => {
  const data: RegisterModuleItem = req.body;
  data.moduleId = req.params.moduleId;
  const newModuleItem: ModuleItem = createModuleItem(data);
  let code = 200;
  if (data.downloadableFile != null) {
    const file: RegisterFile = data.downloadableFile;
    file.attachedAt = newModuleItem;
    newModuleItem.hasDownloadableFile = true;
    code = await registerFile(file);
  }
  if (code === 200) {
    await saveNewModuleItem(newModuleItem, res);
  } else {
    res.sendStatus(403);
  }
};

/**
 * @exports
 * @async
 * Updates a moduleItem with the data given by the HTTP-Request
 * @param {Request} req - Holds the data from the HTTP-Request
 * @param {Response} res - Used to form the response
 */
export const changeModuleItem = async (req: Request, res: Response) => {
  try {
    const data: ChangeModuleItem = req.body;
    const { moduleId } = req.params;
    const { moduleItemId } = req.params;
    const moduleItem: any = await getOneObject({
      where: { id: moduleItemId, moduleId },
    }, ModuleItem);
    if (data.content != null) {
      moduleItem.content = data.content;
    }
    if (data.webLink != null) {
      moduleItem.webLink = data.webLink;
    }
    if (data.hasFileUpload != null) {
      moduleItem.hasFileUpload = data.hasFileUpload;
    }
    if (data.isVisible != null) {
      moduleItem.isVisible = data.isVisible;
    }
    if (data.dueDate != null) {
      moduleItem.dueDate = new Date(data.dueDate);
    }
    await saveObject(moduleItem, ModuleItem);
    res.status(200).send('ModuleItem has been changed');
  } catch (_err) {
    res.status(500).send('ModuleItem could not be changed');
  }
};
/**
 * @exports
 * @async
 * Deletes one moduleItem with the data given by the HTTP-Request
 * @param {Request} req - Holds the data from the HTTP-Request
 * @param {Response} res - Used to form the response
 */
export const deleteModuleItem = async (req: Request, res: Response) => {
  try {
    const { moduleItemId } = req.params;
    const { moduleId } = req.params;
    const moduleItem: any = await getOneObject({
      where: { id: moduleItemId, moduleId },
    }, ModuleItem);
    await deleteObjects(moduleItem, ModuleItem);
    res.send(200).status('The ModuleItem has been deleted');
  } catch (_err) {
    res.send(500).status('ModuleItem could not be deleted');
  }
};
/**
 * @exports
 * @async
 * Deletes all moduleItems of the module with the data given by the HTTP-Request
 * @param {Request} req - Holds the data from the HTTP-Request
 * @param {Response} res - Used to form the response
 */
export const deleteAllModuleItems = async (req: Request, res: Response) => {
  try {
    const { moduleId } = req.params;
    const moduleItems: any = await getObjects({ where: { moduleId } }, ModuleItem);
    await deleteObjects(moduleItems, ModuleItem);
    res.send(200).status('The ModuleItems have been deleted');
  } catch (_err) {
    res.send(500).status('ModuleItems could not be deleted');
  }
};
/**
 * @exports
 * @async
 * Returns a moduleItem with the data given by the HTTP-Request
 * @param {Request} req - Holds the data from the HTTP-Request
 * @param {Response} res - Used to form the response
 */
export const selectModuleItem = async (req: Request, res: Response) => {
  try {
    const { moduleItemId } = req.params;
    const { moduleId } = req.params;
    const moduleItem: any = await getOneObject({
      where: { id: moduleItemId, moduleId },
    }, ModuleItem);
    res.status(200).send(moduleItem);
  } catch (_err) {
    res.status(500).send('ModuleItem could not be found');
  }
};
/**
 * @exports
 * @async
 * Returns all moduleItems of the module with the data given by the HTTP-Request
 * @param {Request} req - Holds the data from the HTTP-Request
 * @param {Response} res - Used to form the response
 */
export const selectAllModuleItems = async (req: Request, res: Response) => {
  try {
    const { moduleId } = req.params;
    const moduleItems: any = await getObjects({ where: { moduleId } }, ModuleItem);
    res.status(200).send(moduleItems);
  } catch (_err) {
    res.status(500).send('No ModuleItems found for Module');
  }
};
/**
 * @exports
 * @async
 * Adds a downloadable file to a moduleItem with the data given by the HTTP-Request
 * @param {Request} req - Holds the data from the HTTP-Request
 * @param {Response} res - Used to form the response
 */
export const addDownloadFile = async (req: Request, res: Response) => {
  try {
    const data: RegisterFile = req.body;
    const { moduleId } = req.params;
    const { moduleItemId } = req.params;
    const moduleItem: any = await getOneObject({
      where: { id: moduleItemId, moduleId },
    }, ModuleItem);
    moduleItem.hasDownloadableFile = true;
    data.attachedAt = moduleItem;
    registerFile(data);
    saveObject(moduleItem, ModuleItem);
    res.status(200).send('Added new File to ModuleItem');
  } catch (_err) {
    res.status(500).send('Could not add File to ModuleItem');
  }
};
/**
 * @exports
 * @async
 * Deletes the downlaodable file of the moduleItem with the data given by the HTTP-Request
 * @param {Request} req - Holds the data from the HTTP-Request
 * @param {Response} res - Used to form the response
 */
export const deleteDownloadFile = async (req: Request, res: Response) => {
  try {
    const { moduleId } = req.params;
    const { moduleItemId } = req.params;
    const file: any = await getOneObject({ where: { attachedAt: moduleItemId } }, File);
    const moduleItem: any = await getOneObject({
      where: { id: moduleItemId, moduleId },
    }, ModuleItem);
    moduleItem.hasDownloadableFile = false;
    await saveObject(moduleItem, ModuleItem);
    await deleteObjects(file, File);
    res.status(200).send('Deleted File');
  } catch (_err) {
    res.status(500).send('Could not delete File');
  }
};

export const uploadFile = async (req: Request, res: Response) => {
  try {
    const { moduleId } = req.params;
    const { moduleItemId } = req.params;
    const data: RegisterFile = req.body;
    const moduleItem: any = await getOneObject({
      where: { id: moduleItemId, moduleId },
    }, ModuleItem);
    if (moduleItem.hasFileUpload) {
      data.attachedAt = moduleItem;
      await registerFile(data);
      res.status(200).send('File has been uploaded');
    } else {
      res.status(500).send('Internal Error: ModuleItem has no file upload');
    }
  } catch (_err) {
    res.status(500).send('Could not upload file');
  }
};

export const deleteUploadedFile = async (req: Request, res: Response) => {
  try {
    const { moduleId } = req.params;
    const { moduleItemId } = req.params;
    const data: DeleteUploadedFile = req.body;
    const moduleItem: any = await getOneObject({
      where: { id: moduleItemId, moduleId },
    }, ModuleItem);
    if (moduleItem.hasFileUpload) {
      const file: any = await getOneObject({
        where: { id: data.fileId, attachedAt: moduleItemId },
      }, File);
      await deleteObjects(file, File);
      res.status(200).send('File has been deleted');
    } else {
      res.status(500).send('Internal Error: ModuleItem has no file upload');
    }
  } catch (_err) {
    res.status(500).send('Could not delete file');
  }
};

export const deleteAllUploadedFile = async (req: Request, res: Response) => {
  try {
    const { moduleId } = req.params;
    const { moduleItemId } = req.params;
    const moduleItem: any = await getOneObject({
      where: { id: moduleItemId, moduleId },
    }, ModuleItem);
    if (moduleItem.hasFileUpload) {
      const file: any = await getObjects({
        where: { attachedAt: moduleItemId },
      }, File);
      await deleteObjects(file, File);
      res.status(200).send('File has been deleted');
    } else {
      res.status(500).send('Internal Error: ModuleItem has no file upload');
    }
  } catch (_err) {
    res.status(500).send('Could not delete file');
  }
};
