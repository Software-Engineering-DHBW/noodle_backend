import {Request, Response} from "express";
import {getConnection} from "typeorm";
import {User} from "../entity/User";
import {UserDetail} from "../entity/UserDetail"
import * as argon2 from "argon2";

/**
 * Representation of the incoming data of a new user
 * @interface
 */
interface RegisterUser {
  username: string;
  password: string;
  role: string;
  fullname: string;
  address: string;
  matriculation_number: string;
  mail: string;
}

/**
 * @exports
 * Registers a new User with the data given by the HTTP-Request
 * @param {Request} req - Holds the data from the HTTP-Request
 * @param {Response} res - Used to form the response
 */
export const register_user = async (req: Request, res: Response) => {
  const data: RegisterUser = req.body;
  const new_user: User = await create_user(data);
  const new_user_detail: UserDetail = create_user_detail(data, new_user);
  save_new_user(new_user, new_user_detail, res);
} 

/**
 * Creates a new User with the given data
 * @param {RegisterUser} data - Data of the new user
 * @returns {Promise<User>}
 */
const create_user = async (data: RegisterUser): Promise<User> => {
  const new_user = new User();
  new_user.username = data.username;
  new_user.password = await argon2.hash(data.password);
  switch(data.role){
    case "teacher":
      new_user.is_teacher = true;break;
    case "administrator":
      new_user.is_administrator = true;break;
  }
  return new_user;
}

/**
 * Creates a new UserDetail with the given data
 * @param {RegisterUser} data - Details of the new User
 * @param {User} new_user - Already created User-Object
 * @returns {UserDetail}
 */
const create_user_detail = (data: RegisterUser, new_user: User): UserDetail => {
  const new_user_detail = new UserDetail();
  new_user_detail.user_id = new_user
  new_user_detail.fullname = data.fullname;
  new_user_detail.address = data.address
  new_user_detail.matriculation_number = data.matriculation_number;
  new_user_detail.mail = data.mail;
  return new_user_detail;
}

/**
 * Saves the create User- and UserDetail-Object inside the database.
 * No data is stored, if one of the objects could not be stored, in this case a response with HTTP-Status 403 will be formed.
 * Forms a response with HTTP-Code 200 if the objects could be stored.
 * @param {User} new_user - New User to store
 * @param {UserDetail} new_user_detail - Details of the new user
 * @param {Response} res - Response object for sending the response
 */
const save_new_user = async(new_user: User, new_user_detail: UserDetail, res: Response): Promise<void>  => {
  const queryRunner = getConnection().createQueryRunner();
  await queryRunner.startTransaction();
  try {
    await queryRunner.manager.save(new_user);
    await queryRunner.manager.save(new_user_detail);
    await queryRunner.commitTransaction();

    res.sendStatus(200);
  } catch (_err) {
    await queryRunner.rollbackTransaction();
    res.sendStatus(404);
  }
}

export const login_user = (req: Request, res: Response): void => {
  const data = req.data;
}
