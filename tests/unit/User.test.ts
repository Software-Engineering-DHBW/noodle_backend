import * as supertest from 'supertest';
import app from '../../src/app';
import * as helper from './helper';

describe('/user', () => {
  describe('POST /user/login', () => {
    const path = '/user/login';
    test.each([
      ['Successfull login', 'administrator', 'administrator', 200],
      ['403 Wrong Username', 'wrong', 'administrator', 403],
      ['403 Wrong Password', 'administrator', 'wrong', 403],
      ['403 Empty Password', 'administrator', '', 403],
      ['403 Empty Username', '', 'administrator', 403],
    ])('%s', async (msg, username, password, expected) => {
      const testUser = {
        username,
        password,
      };
      const res = await helper.postNoAuth(path, testUser);
      expect(res.statusCode).toEqual(expected);
    });
  });

  describe('POST /user/changePassword', () => {
    const changePath = '/user/changePassword';
    const loginPath = '/user/login';
    test.each([
      ['Successfull change administrator', 'administrator', 'administrator', 'new', 'administratorCookie', true, 200],
      ['Successfull change administrator other user', 'teacher', 'teacher', 'new', 'administratorCookie', true, 200],
      ['Successfull change teacher', 'teacher', 'teacher', 'new', 'teacherCookie', true, 200],
      ['Successfull change student', 'student', 'student', 'new', 'studentCookie', true, 200],
      ['403 Not own password change teacher', 'administrator', 'administrator', 'new', 'teacherCookie', true, 403],
      ['403 Not own password change student', 'administrator', 'administrator', 'new', 'studentCookie', true, 403],
      ['403 On empty username', null, 'administrator', 'new', 'studentCookie', true, 403],
      ['403 On empty password', 'administrator', null, 'new', 'studentCookie', false, 403],
    ])('%s', async (msg, username, oldPassword, newPassword, cookie, login, expected) => {
      const testCookie = global[cookie];
      const newPasswordUser = {
        username,
        password: newPassword,
      };
      const oldPasswordUser = {
        username,
        password: oldPassword,
      };
      let res = await helper.postAuth(changePath, newPasswordUser, testCookie);
      expect(res.statusCode).toEqual(expected);
      if (login) {
        res = await helper.postNoAuth(loginPath, newPasswordUser);
        expect(res.statusCode).toEqual(expected);
        res = await helper.postAuth(changePath, oldPasswordUser, testCookie);
        expect(res.statusCode).toEqual(expected);
      }
    });
  });
});
