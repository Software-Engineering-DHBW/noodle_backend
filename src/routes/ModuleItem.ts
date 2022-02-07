import { Response } from 'express';
import { getConnection } from 'typeorm';
import File from '../entity/File';
import ModuleItem from '../entity/ModuleItem';
import { RegisterModuleItem } from './Module';
import { RegisterFile } from './File';

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
const saveNewModuleItem = async (newModuleItem:ModuleItem, res: Response, newFile?: File) => {
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

export const registerModuleItem = (data: RegisterModuleItem, res: Response) => {
  const newModuleItem: ModuleItem = createModuleItem(data);
  if (data.downloadableFile != null) {
    const newFile: File = createFile(data, newModuleItem);
    saveNewModuleItem(newModuleItem, res, newFile);
  } else {
    saveNewModuleItem(newModuleItem, res);
  }
};

export const usless = () => {

};
