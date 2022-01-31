import { Request, Response } from "express";
import { getConnection } from "typeorm";
import { File } from "../entity/File";
import { User } from "../entity/User";

/**
 * Representation of the incoming data of a new file
 * @interface
 */
interface RegisterFile {
    owner: User
    name: string;
    path: string;
    upload_date: Date;
}

/**
 * @exports
 * Registers a new File with the data given by the HTTP-Request
 * @param {Request} req - Holds the data from the HTTP-Request
 * @param {Response} res - Used to form the response
 */
export const register_file = (req: Request, res: Response) => {
    const data: RegisterFile = req.body;
    const new_file: File = create_file(data);
    save_new_file(new_file, res);
}

/**
 * Creates a new File with the given data
 * @param {RegisterFile} data - Data of the new file
 * @returns {File}
 */
const create_file = (data: RegisterFile): File => {
    const new_file = new File();
    new_file.owner = data.owner;
    new_file.name = data.name;
    new_file.path = data.path;
    new_file.upload_date = data.upload_date;  //can maybe changed to Date.now() or similar function 
    return new_file;
}

/**
 * Saves the create File-Object inside the database.
 * No data is stored, if the object could not be stored, in this case a response with HTTP-Status 403 will be formed.
 * Forms a response with HTTP-Code 200 if the object could be stored.
 * @param {File} new_file - New File to store
 * @param {Response} res - Response object for sending the response
 */
const save_new_file = async (new_file: File, res: Response): Promise<void> => {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.startTransaction();
    try {
        await queryRunner.manager.save(new_file);
        await queryRunner.commitTransaction();
        res.sendStatus(200);
    } catch (_err) {
        await queryRunner.rollbackTransaction();
        res.sendStatus(403);
    }
}
