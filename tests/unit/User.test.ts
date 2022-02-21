import * as supertest from 'supertest';
import app from '../../src/app';

describe('/user', () => {
  describe('POST /user/login', () => {
    test('Get a jwt after a successfull login', async () => {
      const res = await supertest(await app)
        .post('/user/login')
        .send({
          username: 'administrator',
          password: 'administrator',
        });
      expect(res.statusCode).toEqual(200);
    });

    test('HTTP-Status 403 after a wrong username', async () => {
      const res = await supertest(await app)
        .post('/user/login')
        .send({
          username: 'wrong',
          password: 'administrator',
        });
      expect(res.statusCode).toEqual(403);
    });

    test('HTTP-Status 403 after a wrong password', async () => {
      const res = await supertest(await app)
        .post('/user/login')
        .send({
          username: 'administrator',
          password: 'wrong',
        });
      expect(res.statusCode).toEqual(403);
    });
  });

  describe('POST /user/insert', () => {});
});
