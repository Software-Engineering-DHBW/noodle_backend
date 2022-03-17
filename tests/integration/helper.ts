import { ConnectionOptions } from 'typeorm';
import * as supertest from 'supertest';
import app from '../../src/app';

export const ormOptions: ConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'noodle',
  password: 'noodle',
  database: 'noodle',
  schema: 'e2e',
  entities: [`${__dirname}/../../src/entity/*{.js,.ts}`],
  synchronize: true,
};

export const postNoAuth = (path: String, body: Object) => supertest(app)
  .post(path)
  .send(body);

export const postAuth = (path: String, body: Object, token: String) => supertest(app)
  .post(path)
  .send(body)
  .set('Authorization', `Bearer ${token}`);

export const getAuth = (path: String, token: String) => supertest(app)
  .get(path)
  .set('Authorization', `Bearer ${token}`);
