#!/usr/bin/env node
import 'reflect-metadata';
import {
  ConnectionOptions, createConnection, getManager, EntityManager,
} from 'typeorm';
import * as crypto from 'crypto';
import * as argon2 from 'argon2';
import app from './app';
import User from './entity/User';
import UserDetail from './entity/UserDetail';

const E2E: boolean = process.env.NODE_ENV === 'e2e';
const PROD: boolean = process.env.NODE_ENV === 'production';

let ormOptions: ConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'noodle',
  password: 'noodle',
  database: 'noodle',
  synchronize: true,
  entities: [`${__dirname}/entity/*{.js,.ts}`],
};
if (E2E) {
  ormOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'noodle',
    password: 'noodle',
    database: 'noodle',
    schema: 'e2e',
    entities: [`${__dirname}/entity/*{.js,.ts}`],
    synchronize: true,
  };
}

const initDatabase = async (ormOptions: ConnectionOptions) => {
  await createConnection(ormOptions).then(async (connection) => {
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
    connection.close();
  });
};

const args = process.argv.slice(2);
if (args[0] === 'init') {
  initDatabase(ormOptions);
} else {
  createConnection(ormOptions).then(async (connection) => {
    if (PROD) {
      process.env.jwtSignatureKey = crypto.randomBytes(64).toString('base64url');
    } else {
      process.env.jwtSignatureKey = 'Development';
    }

    if (!E2E) {
      app.listen(3000);
      console.log('Tables initialized and express application up and running on port 3000');
    }
    connection.close();
  }).catch((error) => console.log(error));
}

export default ormOptions;
