import { getConnection } from 'typeorm';
import File from '../entity/File';
import ModuleItem from '../entity/ModuleItem';
import User from '../entity/User';

/**
 * Representation of the incoming data of a new file
 * @interface
 */
export interface RegisterFile {
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
 * @async
 * Saves the create File-Object inside the database.
 * No data is stored, if the object could not be stored,
 * in this case a response with HTTP-Status 403 will be formed.
 * Forms a response with HTTP-Code 200 if the object could be stored.
 * @param {File} newFile - New File to store
 * @param {Response} res - Response object for sending the response
 */
const saveNewFile = async (newFile: File): Promise<number> => {
  const queryRunner = getConnection().createQueryRunner();
  await queryRunner.startTransaction();
  try {
    await queryRunner.manager.save(newFile);
    await queryRunner.commitTransaction();
    return 200;
  } catch (_err) {
    await queryRunner.rollbackTransaction();
    return 403;
  }
};

/**
 * @async
 * Registers a new File with the data given by the HTTP-Request
 * @param {Request} req - Holds the data from the HTTP-Request
 * @param {Response} res - Used to form the response
 */
export const registerFile = async (data: RegisterFile): Promise<number> => {
  const newFile: File = createFile(data);
  return saveNewFile(newFile);
};
