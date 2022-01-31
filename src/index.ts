import "reflect-metadata";
import { createConnection } from "typeorm";
import { User } from "./entity/User";
import { UserDetail } from "./entity/UserDetail"
import { Course } from "./entity/Course";
import { Module } from "./entity/Module";
import { ModuleItem } from "./entity/ModuleItem";
import { File } from "./entity/File";
import * as argon2 from "argon2";
import * as express from "express";
import { router } from "./routes"

createConnection().then(async connection => {

  /*Just for demonstrating purposes, can be removed after understanding the code
  //Add test-user to user
    console.log("Inserting a new user into the database...");
    const user = new User();
    user.username = "Test";
    user.password = await argon2.hash("Test");
    await connection.manager.save(user);
    console.log("Saved a new user with id: " + user.id);
  }

  //Add test-user to userDetails
  console.log("Loading users from the database...");
  const users = await connection.manager.findOne(User);
  console.log("Loaded users: ", users);

  const testUserDetail = await connection.manager.findOne(UserDetail, { where: {user_id: users}});
  if (!testUserDetail) {
    const testUserDetail = new UserDetail();
    testUserDetail.user_id = users;
    testUserDetail.fullname = "Test Test";
    testUserDetail.address = "Test";
    testUserDetail.matriculation_number = "12345";
    testUserDetail.mail = "test@test.com";
    await connection.manager.save(testUserDetail)
  }

  console.log("Loading users from the database...");
  const usersDetail = await connection.manager.findOne(UserDetail, {relations: ["user_id"]});
  console.log("Loaded users: ", usersDetail);

  console.log("Here you can setup and run express/koa/any other framework.");
  */

  const app = express();
  app.use(express.json());
  app.use(router);

  app.listen(3000);

  console.log("Tables initialized and express application up and running on port 3000");

}).catch(error => console.log(error));
