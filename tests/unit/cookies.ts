import * as supertest from 'supertest';
import { createConnection, getConnection } from 'typeorm';
import app from '../../src/app';
import { ormOptions } from './helper';

beforeAll(async () => {
  await createConnection(ormOptions).then(async () => {
    let res = await supertest(app)
      .post('/user/login')
      .send({
        username: 'administrator',
        password: 'administrator',
      });
    global.administratorCookie = res.text;
    res = await supertest(app)
      .post('/user/login')
      .send({
        username: 'teacher',
        password: 'teacher',
      });
    global.teacherCookie = res.text;
    res = await supertest(app)
      .post('/user/login')
      .send({
        username: 'student',
        password: 'student',
      });
    global.studentCookie = res.text;
  });
});

afterAll(async () => {
  const conn = getConnection('default');
  conn.close();
});
