#!/usr/bin/env node
import 'reflect-metadata';
import {
  ConnectionOptions, createConnection, getManager, EntityManager,
} from 'typeorm';
import * as argon2 from 'argon2';
import app from './app';
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
  entities: [`${__dirname}/entity/*{.js,.ts}`],
};

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
  createConnection(ormOptions).then(async () => {
    app.listen(3000);
    console.log('Tables initialized and express application up and running on port 3000');
  }).catch((error) => console.log(error));
}

export default ormOptions;
