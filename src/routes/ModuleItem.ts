import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import File from '../entity/File';
import ModuleItem from '../entity/ModuleItem';
import Module from '../entity/Module';
import User from '../entity/User';
import { deleteObjects, getObjects, getOneObject } from './Manager';

/**
 * Representation of the incoming data of a moduleItem
 * @interface
 */
interface RegisterModuleItem {
  moduleId?: Module;
  content?: string;
  webLink?: string;
  downloadableFile?: File;
  hasFileUpload: boolean;
  uploadedFiles?: File[];
  isVisible: boolean;
  fileOwner?: User;
  fileName?: string;
  filePath?: string;
  fileUploadDate?: Date;
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
}
/**
 * Representation of the incoming data of a moduleItem
 * @interface
 */
interface ChangeDownloadableFile {
  downloadableFile: File;
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
  return newModuleItem;
};
/**
 * Creates a new File with the given data
 * @param {GeneralModule} data - Data of the new module
 * @returns {Module}
 */
const createFile = (data: RegisterModuleItem, newModuleItem: ModuleItem): File => {
  const newFile = new File();
  newFile.owner = data.fileOwner;
  newFile.name = data.fileName;
  newFile.path = data.filePath;
  newFile.uploadDate = data.fileUploadDate;
  newFile.uploadedAt = newModuleItem;
  return newFile;
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
const saveNewModuleItem = async (newModuleItem: ModuleItem, res: Response, newFile?: File) => {
  const queryRunner = getConnection().createQueryRunner();
  await queryRunner.startTransaction();
  try {
    await queryRunner.manager.save(newModuleItem);
    if (newFile != null) {
      await queryRunner.manager.save(newFile);
    }
    await queryRunner.commitTransaction();
    res.sendStatus(200);
  } catch (_err) {
    await queryRunner.rollbackTransaction();
    res.sendStatus(403);
  }
};

export const registerModuleItem = (req: Request, res: Response) => {
  const data: RegisterModuleItem = req.body;
  data.moduleId = req.params.moduleId;
  const newModuleItem: ModuleItem = createModuleItem(data);
  if (data.downloadableFile != null) {
    const newFile: File = createFile(data, newModuleItem);
    saveNewModuleItem(newModuleItem, res, newFile);
  } else {
    saveNewModuleItem(newModuleItem, res);
  }
};

// link, content, visibility, hasfileupload
// can only edit a value not delete it
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
    res.status(200).send('ModuleItem has been changed');
  } catch (_err) {
    res.status(500).send('ModuleItem could not be changed');
  }
};
// löschen ein item
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
// löschen alle items
export const deleteAllModuleItems = async (req: Request, res: Response) => {
  try {
    const { moduleId } = req.params;
    const moduleItem: any = await getObjects({ where: { moduleId } }, ModuleItem);
    await deleteObjects(moduleItem, ModuleItem);
    res.send(200).status('The ModuleItems have been deleted');
  } catch (_err) {
    res.send(500).status('ModuleItems could not be deleted');
  }
};
// ein moduleitem auflisten
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
// alle moduleItems auflisten
export const selectAllModuleItems = async (req: Request, res: Response) => {
  try {
    const { moduleId } = req.params;
    const moduleItems: any = await getObjects({ where: { moduleId } }, ModuleItem);
    res.status(200).send(moduleItems);
  } catch (_err) {
    res.status(500).send('No ModuleItems found for Module');
  }
};
// downloadfile hinzufügen
export const addDownloadFile = (req: Request, res: Response) => {
  const data = req.body;
  const { moduleId } = req.params;
};
// downloadfile löschen
export const deleteDownloadFile = (req: Request, res: Response) => {
  const data = req.body;
  const { moduleId } = req.params;
};
