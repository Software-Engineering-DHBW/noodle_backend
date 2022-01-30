import {Request, Response} from "express";
import {getConnection, getRepository, Repository} from "typeorm";
import {User} from "../entity/User";
import {UserDetail} from "../entity/UserDetail"
import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";

/**
 * Representation of the incoming data of a new user
 * @interface
 */
interface RegisterUser extends LoginUser {
  role: string;
  fullname: string;
  address: string;
  matriculation_number: string;
  mail: string;
}

/**
 * Representation of the incoming data of a user login
 * @interface
 */
interface LoginUser extends DeleteUser {
  password: string;
}

/**
 * Representation of the incoming data for removing a user
 * @interface
 */
interface DeleteUser {
  username: string;
}

/**
 * @exports
 * @async
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
 * @async
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
 * @async
 * Saves the create User- and UserDetail-Object inside the database.
 * No data is stored, if one of the objects could not be stored, in this case a response with HTTP-Status 403 will be formed.
 * Forms a response with HTTP-Code 200 if the objects could be stored.
 * @param {User} new_user - New User to store
 * @param {UserDetail} new_user_detail - Details of the new user
 * @param {Response} res - Response object for sending the response
 */
const save_new_user = async (new_user: User, new_user_detail: UserDetail, res: Response): Promise<void>  => {
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

/**
 * @exports
 * @async
 * Tries to login a user with the given credentials
 * @param {Request} req - Received request object
 * @param {Response} res - Received response object
 * @returns HTTP-Status 200 and JWT
 * @throws HTTP-Status 403 and "Wrong username or password" - Invalid username or wrong password
 */
export const login_user = async (req: Request, res: Response): Promise<void> => {
  try {
    const data: LoginUser = req.body;
    const user: User = await get_user_login(data);
    if (!await argon2.verify(user.password, data.password)) {
      throw new Error();
    }
    const user_details: UserDetail = await get_user_detail(user);
    res.status(200).send(await create_login_jwt(user, user_details)) 
  } catch (_err) {
    res.status(403).send("Wrong username or password");
    return;
  }
}

/**
 * @async
 * Find all users with the given username in the Repository 'User'
 * @param {LoginUser} data - Given username from the request
 * @returns {Promise<User[]>}
 */
const get_user_login = async (data: LoginUser|DeleteUser): Promise<User> => {
  if (data.username === undefined || data.username === null) {
    throw new Error();
  }
  const user_repository = await getRepository(User);
  return await user_repository.findOneOrFail({ where: { username: data.username}})
}

/**
 * @async
 * Find the user-details from the Repository 'UserDetail' for the already selected user
 * @param {User} user - Selected user
 * @returns {Promise<UserDetail[]>}
 */
const get_user_detail = async (user: User): Promise<UserDetail> => {
  if (user === undefined || user === null){
    throw new Error();
  }
  const user_detail_respository = await getRepository(UserDetail);
  return await user_detail_respository.findOneOrFail({ where: {user_id: user}})
}

/**
 * @async
 * Create a signed JWT with the found user and their user-details
 * @param {User} user - Selected user
 * @param {UserDetail} user_details - Details of the selected user
 * @returns {Promise<String>} Signed JWT as string
 */
const create_login_jwt = async (user: User, user_details: UserDetail): Promise<string> => {
  let role = "student"
  if (user.is_administrator) {
    role = "administrator";
  } else if (user.is_teacher) {
    role = "teacher";
  }
  return await jwt.sign({
    "id": user.id,
    "username": user.username,
    "fullName": user_details.fullname,
    "role": role,
    "exp": Math.floor(Date.now() / 1000) + (12 * 60 * 60)
  }, "", {algorithm: "none"});
}

/**
 * @exports
 * Deletes the user with the given username and id
 * @param {Request} req - Received request object
 * @param {Response} res - Received response object
 */
export const delete_user = async (req: Request, res: Response) => {
  try{
    const data: DeleteUser = req.body;
    const user: User = await get_user_login(data)
    await delete_user_details_from_repository(user);
    await delete_user_from_repository(user);
    res.status(200).send("The user has been deleted");
  } catch (_err) {
    console.log(_err)
    res.status(500).send("The user could not be deleted");
  }
}
/**
 * Deletes the entry from the repository 'UserDetail'
 * @param {User} data - The user to delete 
 */
const delete_user_details_from_repository = async (user: User) => {
  const user_detail_respository: Repository<UserDetail> = await getRepository(UserDetail);
  await user_detail_respository.delete({ user_id: user })
}
/**
 * Deletes the entry from the repository 'User'
 * @param {User} user - The user to delete 
 */
const delete_user_from_repository = async (user: User) => {
  const user_respository: Repository<User> = await getRepository(User);
  await user_respository.delete(user)
}

/**
 * Changes the password of a user
 * @param {Request} req - Received request object
 * @param {Response} res - Received response object
 */
export const change_user_password = async (req: Request, res: Response) => {
  try {
  const data: LoginUser = req.body;
  const user: User = await get_user_login(data);
  await change_password(data.password, user);  
  res.status(200).send("The password has been changed.");
  } catch (_err) {
    res.staus(500).send("Password could not be changed.");
  }
}
/**
 * Change the attribute 'password' in the repository 'User' of the given user
 * @param {string} password - New pasword
 * @param {User} user - User, which want to change their password
 */
const change_password = async (new_password: string, user: User) => {
  new_password = await argon2.hash(new_password);
  const user_respository: Repository<User> = await getRepository(User);
  await user_respository.update({ id: user.id }, { password: new_password });
}
