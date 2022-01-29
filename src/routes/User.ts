import {Request, Response} from "express";
import {getConnection} from "typeorm";
import {User} from "../entity/User";
import {UserDetail} from "../entity/UserDetail"
import * as argon2 from "argon2";

export const register_user = async (req: Request, res: Response) => {
  const data = req.body;
  const new_user: User = await create_user(data);
  const new_user_detail: UserDetail = create_user_detail(data, new_user);
  save_new_user(new_user, new_user_detail, res);
} 

const create_user = async (data): Promise<User> => {
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

const create_user_detail = (data, new_user: User): UserDetail => {
  const new_user_detail = new UserDetail();
  new_user_detail.user_id = new_user
  new_user_detail.fullname = data.fullname;
  new_user_detail.address = data.address
  new_user_detail.matriculation_number = data.matriculation_number;
  new_user_detail.mail = data.mail;
  return new_user_detail;
}

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
  console.log("login");
}
