import { Request, Response } from 'express';
import { getConnection, getRepository, Repository } from 'typeorm';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';
import User from '../entity/User';
import UserDetail from '../entity/UserDetail';

/**
 * Representation of the incoming data for removing a user
 * @interface
 */
interface DeleteUser {
  username: string;
}

/**
 * Representation of the incoming data of a user login
 * @interface
 */
interface LoginUser extends DeleteUser {
  password: string;
}

/**
 * Representation of the incoming data of a new user
 * @interface
 */
interface RegisterUser extends LoginUser {
  role: string;
  fullname: string;
  address: string;
  matriculationNumber: string;
  mail: string;
}

/**
 * @async
 * Creates a new User with the given data
 * @param {RegisterUser} data - Data of the new user
 * @returns {Promise<User>}
 */
const createUser = async (data: RegisterUser): Promise<User> => {
  const newUser = new User();
  newUser.username = data.username;
  newUser.password = await argon2.hash(data.password);
  switch (data.role) {
    case 'teacher':
      newUser.isTeacher = true; break;
    case 'administrator':
      newUser.isAdministrator = true; break;
    default:
      break;
  }
  return newUser;
};
/**
 * Creates a new UserDetail with the given data
 * @param {RegisterUser} data - Details of the new User
 * @param {User} new_user - Already created User-Object
 * @returns {UserDetail}
 */
const createUserDetail = (data: RegisterUser, newUser: User): UserDetail => {
  const newUserDetail = new UserDetail();
  newUserDetail.userId = newUser;
  newUserDetail.fullname = data.fullname;
  newUserDetail.address = data.address;
  newUserDetail.matriculationNumber = data.matriculationNumber;
  newUserDetail.mail = data.mail;
  return newUserDetail;
};

/**
 * @async
 * Saves the create User- and UserDetail-Object inside the database.
 * No data is stored, if one of the objects could not be stored,
 * in this case a response with HTTP-Status 403 will be formed.
 * Forms a response with HTTP-Code 200 if the objects could be stored.
 * @param {User} new_user - New User to store
 * @param {UserDetail} new_user_detail - Details of the new user
 * @param {Response} res - Response object for sending the response
 */
const saveNewUser = async (newUser: User, newUserDetail: UserDetail, res: Response): Promise<void> => {
  const queryRunner = getConnection().createQueryRunner();
  await queryRunner.startTransaction();
  try {
    await queryRunner.manager.save(newUser);
    await queryRunner.manager.save(newUserDetail);
    await queryRunner.commitTransaction();

    res.sendStatus(200);
  } catch (_err) {
    await queryRunner.rollbackTransaction();
    res.sendStatus(403);
  }
};

/**
 * @exports
 * @async
 * Registers a new User with the data given by the HTTP-Request
 * @param {Request} req - Holds the data from the HTTP-Request
 * @param {Response} res - Used to form the response
 */
export const registerUser = async (req: Request, res: Response) => {
  const data: RegisterUser = req.body;
  const newUser: User = await createUser(data);
  const newUserDetail: UserDetail = createUserDetail(data, newUser);
  saveNewUser(newUser, newUserDetail, res);
};

/**
 * @async
 * Find all users with the given username in the Repository 'User'
 * @param {LoginUser} data - Given username from the request
 * @returns {Promise<User[]>}
 */
const getUserLogin = async (data: LoginUser|DeleteUser): Promise<User> => {
  if (data.username === undefined || data.username === null) {
    throw new Error();
  }
  const userRepository = getRepository(User);
  return userRepository.findOneOrFail({ where: { username: data.username } });
};
/**
 * @async
 * Find the user-details from the Repository 'UserDetail' for the already selected user
 * @param {User} user - Selected user
 * @returns {Promise<UserDetail[]>}
 */
const getUserDetail = async (user: User): Promise<UserDetail> => {
  if (user === undefined || user === null) {
    throw new Error();
  }
  const userDetailRespository = getRepository(UserDetail);
  return userDetailRespository.findOneOrFail({ where: { user_id: user } });
};
/**
 * @async
 * Create a signed JWT with the found user and their user-details
 * @param {User} user - Selected user
 * @param {UserDetail} user_details - Details of the selected user
 * @returns {Promise<String>} Signed JWT as string
 */
const createLoginJwt = async (user: User, userDetails: UserDetail): Promise<string> => {
  let role = 'student';
  if (user.isAdministrator) {
    role = 'administrator';
  } else if (user.isTeacher) {
    role = 'teacher';
  }
  return jwt.sign({
    id: user.id,
    username: user.username,
    fullName: userDetails.fullname,
    role,
    exp: Math.floor(Date.now() / 1000) + (12 * 60 * 60),
  }, process.env.jwtSignatureKey);
};
/**
 * @exports
 * @async
 * Tries to login a user with the given credentials
 * @param {Request} req - Received request object
 * @param {Response} res - Received response object
 * @returns HTTP-Status 200 and JWT
 * @throws HTTP-Status 403 and "Wrong username or password" - Invalid username or wrong password
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const data: LoginUser = req.body;
    const user: User = await getUserLogin(data);
    if (!await argon2.verify(user.password, data.password)) {
      throw new Error();
    }
    const userDetails: UserDetail = await getUserDetail(user);
    res.status(200).send(await createLoginJwt(user, userDetails));
  } catch (_err) {
    res.status(403).send('Wrong username or password');
  }
};

/**
 * Deletes the entry from the repository 'UserDetail'
 * @param {User} data - The user to delete
 */
const deleteUserDetailsFromRepository = async (user: User) => {
  const userDetailRespository: Repository<UserDetail> = getRepository(UserDetail);
  await userDetailRespository.delete({ userId: user });
};
/**
 * Deletes the entry from the repository 'User'
 * @param {User} user - The user to delete
 */
const deleteUserFromRepository = async (user: User) => {
  const userRespository: Repository<User> = getRepository(User);
  await userRespository.delete(user);
};
/**
 * @exports
 * Deletes the user with the given username and id
 * @param {Request} req - Received request object
 * @param {Response} res - Received response object
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const data: DeleteUser = req.body;
    const user: User = await getUserLogin(data);
    await deleteUserDetailsFromRepository(user);
    await deleteUserFromRepository(user);
    res.status(200).send('The user has been deleted');
  } catch (_err) {
    res.status(500).send('The user could not be deleted');
  }
};

/**
 * Change the attribute 'password' in the repository 'User' of the given user
 * @param {string} password - New pasword
 * @param {User} user - User, which want to change their password
 */
const changePassword = async (newPassword: string, user: User) => {
  const newPasswordHash = await argon2.hash(newPassword);
  const userRespository: Repository<User> = getRepository(User);
  await userRespository.update({ id: user.id }, { password: newPasswordHash });
};
/**
 * Changes the password of a user
 * @param {Request} req - Received request object
 * @param {Response} res - Received response object
 */
export const changeUserPassword = async (req: Request, res: Response) => {
  try {
    const data: LoginUser = req.body;
    const user: User = await getUserLogin(data);
    await changePassword(data.password, user);
    res.status(200).send('The password has been changed.');
  } catch (_err) {
    res.staus(500).send('Password could not be changed.');
  }
};
