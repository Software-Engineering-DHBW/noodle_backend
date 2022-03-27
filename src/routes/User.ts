import { Request, Response } from 'express';
import { getConnection, getRepository, Repository } from 'typeorm';
import { hash, verify } from 'argon2';
import { sign } from 'jsonwebtoken';
import User from '../entity/User';
import UserDetail from '../entity/UserDetail';
import { getOneObject, deleteObjects, saveObject } from './Manager';

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
  newUser.password = await hash(data.password);
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
 * @param {User} newUser - Already created User-Object
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
 * @param {User} newUser - New User to store
 * @param {UserDetail} newUserDetail - Details of the new user
 * @param {Response} res - Response object for sending the response
 */
const saveNewUser = async (
  newUser: User,
  newUserDetail: UserDetail,
  res: Response,
): Promise<void> => {
  const queryRunner = getConnection().createQueryRunner();
  await queryRunner.startTransaction();
  try {
    await queryRunner.manager.save(newUser);
    await queryRunner.manager.save(newUserDetail);
    await queryRunner.commitTransaction();

    res.sendStatus(200);
  } catch (_err) {
    await queryRunner.rollbackTransaction();
    res.sendStatus(500);
  }
};

/**
 * @async
 * Registers a new User with the data given by the HTTP-Request <br>
 * Corresponding API-Call: {@link https://github.com/Software-Engineering-DHBW/noodle_backend/wiki/API#post-userregister | POST /user/register}
 * @param {Request} req - Holds the data from the HTTP-Request
 * @param {Response} res - Used to form the response
 */
export const registerUser = async (req: Request, res: Response) => {
  try {
    const data: RegisterUser = req.body;
    const newUser: User = await createUser(data);
    const newUserDetail: UserDetail = createUserDetail(data, newUser);
    saveNewUser(newUser, newUserDetail, res);
  } catch (_err) {
    res.sendStatus(500);
  }
};

/**
 * @async
 * Create a signed JWT with the found user and their user-details
 * @param {User} user - Selected user
 * @param {UserDetail} userDetails - Details of the selected user
 * @returns {Promise<String>} Signed JWT as string
 */
const createLoginJwt = async (user: User, userDetails: UserDetail): Promise<string> => {
  let role = 'student';
  if (user.isAdministrator) {
    role = 'administrator';
  } else if (user.isTeacher) {
    role = 'teacher';
  }
  return sign({
    id: user.id,
    username: user.username,
    fullName: userDetails.fullname,
    role,
    exp: Math.floor(Date.now() / 1000) + (12 * 60 * 60),
  }, process.env.jwtSignatureKey);
};
/**
 * @async
 * Tries to login a user with the given credentials <br>
 * Corresponding API-Call: {@link https://github.com/Software-Engineering-DHBW/noodle_backend/wiki/API#post-userlogin | POST /user/login}
 * @param {Request} req - Received request object
 * @param {Response} res - Received response object
 * @returns HTTP-Status 200 and JWT
 * @throws HTTP-Status 403 and "Wrong username or password" - Invalid username or wrong password
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const data: LoginUser = req.body;
    const user: any = await getOneObject({ where: { username: data.username } }, User);
    if (!await verify(user.password, data.password)) {
      throw new Error();
    }
    const userDetails: any = await getOneObject({ where: { userId: user } }, UserDetail);
    res.status(200).send(await createLoginJwt(user, userDetails));
  } catch (_err) {
    res.status(403).send('Wrong username or password');
  }
};

/**
 * @async
 * Deletes the user with the given username and id <br>
 * Corresponding API-Call: {@link https://github.com/Software-Engineering-DHBW/noodle_backend/wiki/API#post-userdelete | POST /user/delete}
 * @param {Request} req - Received request object
 * @param {Response} res - Received response object
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const data: DeleteUser = req.body;
    const user: any = await getOneObject({ where: { username: data.username } }, User);
    await deleteObjects({ userId: user }, UserDetail);
    await deleteObjects(user, User);
    res.status(200).send('The user has been deleted');
  } catch (_err) {
    res.status(500).send('The user could not be deleted');
  }
};

/**
 * @async
 * Changes the password of a user <br>
 * Corresponding API-Call: {@link https://github.com/Software-Engineering-DHBW/noodle_backend/wiki/API#post-userchangepassword | POST /user/changePassword}
 * @param {Request} req - Received request object
 * @param {Response} res - Received response object
 */
export const changeUserPassword = async (req: Request, res: Response) => {
  try {
    const data: LoginUser = req.body;
    const user: any = await getOneObject({ where: { username: data.username } }, User);
    user.password = await hash(data.password);
    await saveObject(user, User);
    res.status(200).send('The password has been changed');
  } catch (_err) {
    res.status(500).send('Password could not be changed');
  }
};

/**
 * @async
 * Get all users from the repository <br>
 * Corresponding API-Call: {@link https://github.com/Software-Engineering-DHBW/noodle_backend/wiki/API#get-usergetall | POST /user/getAll}
 * @param {Request} req - Received request object
 * @param {Response} res - Received response object
 */
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users: UserDetail[] = await getRepository(UserDetail)
      .createQueryBuilder('')
      .select([
        'UserDetail.id',
        'UserDetail.fullname',
        'UserDetail.address',
        'UserDetail.matriculationNumber',
        'UserDetail.mail',
        'UserDetail.userId',
        'User.id',
        'User.username',
        'User.isTeacher',
        'User.isAdministrator',
        'User.course',
        'Course.id',
        'Course.name',
      ])
      .leftJoin('UserDetail.userId', 'User')
      .leftJoin('User.course', 'Course')
      .getMany();
    res.status(200).send(users);
  } catch (_err) {
    res.status(500).send('The users could not be retrieved');
  }
};
