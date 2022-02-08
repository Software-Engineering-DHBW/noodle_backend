#!/usr/bin/env node
import 'reflect-metadata';
import {
  ConnectionOptions, createConnection, getManager, EntityManager,
} from 'typeorm';
import * as express from 'express';
import * as crypto from 'crypto';
import * as argon2 from 'argon2';
import router from './routes/index';
import User from './entity/User';
import UserDetail from './entity/UserDetail';

const ormOptions: ConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'noodle',
  password: 'noodle',
  database: 'noodle',
  synchronize: true,
  entities: ['./src/**/*.ts'],
};

const initDatabase = async (ormOptions: ConnectionOptions) => {
  await createConnection(ormOptions).then(async () => {
    const user = new User();
    user.id = 1;
    user.username = 'administrator';
    user.password = await argon2.hash('administrator');
    user.isAdministrator = true;
    const userDetails = new UserDetail();
    userDetails.userId = user;
    userDetails.fullname = 'Administrator';
    userDetails.address = 'Administrator Street';
    userDetails.matriculationNumber = '123456789';
    userDetails.mail = 'admin@noodle.pasta';
    const manager: EntityManager = getManager();
    await manager.save(manager.create(User, user));
    await manager.save(manager.create(UserDetail, userDetails));
    console.log('Noodle is initialized and ready to use');
  });
};

const args = process.argv.slice(2);
if (args[0] === 'init') {
  initDatabase(ormOptions);
} else {
  createConnection(ormOptions).then(async () => {
  /* Just for demonstrating purposes, can be removed after understanding the code
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

    if (process.env.NODE_ENV === 'production') {
      process.env.jwtSignatureKey = crypto.randomBytes(64).toString('base64url');
    } else {
      process.env.jwtSignatureKey = 'Development';
    }
    const app: express.Application = express();
    app.use(express.json());
    app.use(router);

    app.listen(3000);
    console.log('Tables initialized and express application up and running on port 3000');
  }).catch((error) => console.log(error));
}
