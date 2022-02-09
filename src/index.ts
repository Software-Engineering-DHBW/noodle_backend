#!/usr/bin/env node
import 'reflect-metadata';
import {
  ConnectionOptions, createConnection, getManager, EntityManager,
} from 'typeorm';
import * as express from 'express';
import * as crypto from 'crypto';
import * as argon2 from 'argon2';
import rateLimit from 'express-rate-limit';
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
    if (process.env.NODE_ENV === 'production') {
      process.env.jwtSignatureKey = crypto.randomBytes(64).toString('base64url');
    } else {
      process.env.jwtSignatureKey = 'Development';
    }
    const app: express.Application = express();
    app.use(express.json());

    const loginLimiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      standardHeaders: true,
      legacyHeaders: true,
    });
    app.use('/user/login', loginLimiter);
    app.use(router);

    app.listen(3000);
    console.log('Tables initialized and express application up and running on port 3000');
  }).catch((error) => console.log(error));
}
