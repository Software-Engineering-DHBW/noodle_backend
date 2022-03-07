import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import File from '../entity/File';
import ModuleItem from '../entity/ModuleItem';
import Module from '../entity/Module';
import {
  deleteObjects, getObjects, getOneObject, saveObject,
} from './Manager';
import User from '../entity/User';

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

/**
 * Representation of the incoming data for deleting an uploaded file
 * @interface
 */
interface DeleteUploadedFile {
  fileId: number;
}

/**
 * Representation of the incoming data of a new file
 * @interface
 */
interface RegisterFile {
  owner: User
  name: string;
  path: string;
  attachedAt: ModuleItem;
}

/**
 * Creates a new File with the given data
 * @param {RegisterFile} data - Data of the new file
 * @returns {File}
 */
const createFile = (data: RegisterFile): File => {
  const newFile = new File();
  newFile.owner = data.owner;
  newFile.name = data.name;
  newFile.path = data.path;
  const time = Date.now();
  newFile.uploadDate = new Date(time);
  newFile.attachedAt = data.attachedAt;
  return newFile;
};

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
  newModuleItem.dueDate = data.dueDate == null ? undefined : new Date(data.dueDate);
  return newModuleItem;
};

/**
 * @async
 * Saves the create File-Object inside the database.
 * No data is stored, if the object could not be stored,
 * in this case a false will be returned.
 * Returns a true if the object could be stored
 * @param {File} newFile - New File to store
 * @returns {boolean}
 */
const saveNewFile = async (newFile: File): Promise<boolean> => {
  const queryRunner = getConnection().createQueryRunner();
  await queryRunner.startTransaction();
  try {
    await queryRunner.manager.save(newFile);
    await queryRunner.commitTransaction();
    return true;
  } catch (_err) {
    await queryRunner.rollbackTransaction();
    return false;
  }
};

/**
 * @async
 * Saves the create ModuleItem- and File-Object inside the database.
 * No data is stored, if one of the objects could not be stored,
 * in this case a response with HTTP-Status 403 will be formed.
 * Forms a response with HTTP-Code 200 if the objects could be stored.
 * @param {ModuleItem} newModuleItem - New ModuleItem to store
 * @param {Response} res - Response object for sending the response
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

/**
 * @async
 * Registers a new ModuleItem with the data given by the HTTP-Request<br>
 * Corresponding API-Call: {@link https://github.com/Software-Engineering-DHBW/noodle_backend/wiki/API#post-module:moduleidaddmoduleitem | POST /module/:moduleId/addMouduleItem}
 * @param {Request} req - Holds the data from the HTTP-Request
 * @param {Response} res - Used to form the response
 */
export const registerModuleItem = async (req: Request, res: Response) => {
  const data: RegisterModuleItem = req.body;
  data.moduleId = req.params.moduleId;
  const newModuleItem: ModuleItem = createModuleItem(data);
  let code: boolean = true;
  if (data.downloadableFile != null) {
    const file: RegisterFile = data.downloadableFile;
    file.attachedAt = newModuleItem;
    newModuleItem.hasDownloadableFile = true;
    const newFile: File = createFile(file);
    code = await saveNewFile(newFile);
  }
  if (code === true) {
    await saveNewModuleItem(newModuleItem, res);
  } else {
    res.sendStatus(403);
  }
};

/**
 * @async
 * Updates a moduleItem with the data given by the HTTP-Request<br>
 * Corresponding API-Call: {@link https://github.com/Software-Engineering-DHBW/noodle_backend/wiki/API#post-module:moduleid:moduleitemidchangemoduleitem | POST /module/:moduleId/:moduleItemId/changeModuleItem}
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
    Object.assign(moduleItem, data);
    await saveObject(moduleItem, ModuleItem);
    res.status(200).send('ModuleItem has been changed');
  } catch (_err) {
    res.status(500).send('ModuleItem could not be changed');
  }
};

/**
 * @async
 * Deletes a moduleItem with the data given by the HTTP-Request<br>
 * Corresponding API-Call: {@link https://github.com/Software-Engineering-DHBW/noodle_backend/wiki/API#post-module:moduleid:moduleitemiddeletemoduleitem | POST /module/:moduleId/:moduleItemId/deleteModuleItem}
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
 * @async
 * Deletes all moduleItems with the data given by the HTTP-Request<br>
 * Corresponding API-Call: {@link https://github.com/Software-Engineering-DHBW/noodle_backend/wiki/API#post-module:moduleiddeleteallmoduleitems | POST /module/:moduleId/deleteAllModuleItem}
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
 * @async
 * Returns the informations to a moduleItem with the data given by the HTTP-Request<br>
 * Corresponding API-Call: {@link https://github.com/Software-Engineering-DHBW/noodle_backend/wiki/API#get-module:moduleid:moduleitemid | GET /module/:moduleId/:moduleItemId}
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
 * @async
 * Returns the informations of all moduleItems of the module with the data given by the HTTP-Request<br>
 * Corresponding API-Call: {@link https://github.com/Software-Engineering-DHBW/noodle_backend/wiki/API#get-module:moduleidselectmoduleitems | GET /module/:moduleId/selectAllModuleItems}
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
 * @async
 * Adds a downloadable file to a moduleItem with the data given by the HTTP-Request<br>
 * Corresponding API-Call: {@link https://github.com/Software-Engineering-DHBW/noodle_backend/wiki/API#post-module:moduleid:moduleitemidadddownloadfile | POST /module/:moduleId/:moduleItemId/addDownloadFile}
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
    const newFile: File = createFile(data);
    await saveObject(newFile, File);
    await saveObject(moduleItem, ModuleItem);
    res.status(200).send('Added new File to ModuleItem');
  } catch (_err) {
    res.status(500).send('Could not add File to ModuleItem');
  }
};
/**
 * @async
 * Deletes the downlaodable file of the moduleItem with the data given by the HTTP-Request<br>
 * Corresponding API-Call: {@link https://github.com/Software-Engineering-DHBW/noodle_backend/wiki/API#post-module:moduleid:moduleitemiddeletefile | POST /module/:moduleId/:moduleItemId/deleteFile}
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

/**
 * @async
 * Adds a uploaded File to the moduleItem if fileupload is allowed with the data given by the HTTP-Request<br>
 * Corresponding API-Call: {@link https://github.com/Software-Engineering-DHBW/noodle_backend/wiki/API#post-module:moduleid:moduleitemiduploadfile | POST /module/:moduleId/:moduleItemId/uploadFile}
 * @param {Request} req - Holds the data from the HTTP-Request
 * @param {Response} res - Used to form the response
 */
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
      const newFile: File = createFile(data);
      await saveObject(newFile, File);
      res.status(200).send('File has been uploaded');
    } else {
      res.status(500).send('Internal Error: ModuleItem has no file upload');
    }
  } catch (_err) {
    res.status(500).send('Could not upload file');
  }
};

/**
 * @async
 * Deletes a uploaded file of the moduleItem with the data given by the HTTP-Request<br>
 * Corresponding API-Call: {@link https://github.com/Software-Engineering-DHBW/noodle_backend/wiki/API#post-module:moduleid:moduleitemiddeleteuploadedfile | POST /module/:moduleId/:moduleItemId/deleteUploadedFile}
 * @param {Request} req - Holds the data from the HTTP-Request
 * @param {Response} res - Used to form the response
 */
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

/**
 * @async
 * Deletes all uploaded file of the moduleItem with the data given by the HTTP-Request<br>
 * Corresponding API-Call: {@link https://github.com/Software-Engineering-DHBW/noodle_backend/wiki/API#post-module:moduleid:moduleitemiddeletealluploadedfiles | POST /module/:moduleId/:moduleItemId/deleteAllUploadedFiles}
 * @param {Request} req - Holds the data from the HTTP-Request
 * @param {Response} res - Used to form the response
 */
export const deleteAllUploadedFiles = async (req: Request, res: Response) => {
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
