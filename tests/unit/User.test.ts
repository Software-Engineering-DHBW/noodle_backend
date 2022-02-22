import * as jwt from 'jsonwebtoken';
import * as helper from './helper';

const generalPath = '/user';
const loginPath = `${generalPath}/login`;
const changePath = `${generalPath}/changePassword`;
const registerPath = `${generalPath}/register`;
const deletePath = `${generalPath}/delete`;

describe('/user', () => {
  describe('POST /user/login', () => {
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
      const res = await helper.postNoAuth(loginPath, testUser);
      expect(res.statusCode).toEqual(expected);
    });
  });

  describe('POST /user/changePassword', () => {
    test.each([
      ['Successfull change administrator', 'administrator', 'administrator', 'new', 'administratorCookie', true, 200],
      ['Successfull change administrator other user', 'teacher', 'teacher', 'new', 'administratorCookie', true, 200],
      ['Successfull change teacher', 'teacher', 'teacher', 'new', 'teacherCookie', true, 200],
      ['Successfull change student', 'student', 'student', 'new', 'studentCookie', true, 200],
      ['403 Not own password change teacher', 'administrator', 'administrator', 'new', 'teacherCookie', true, 403],
      ['403 Not own password change student', 'administrator', 'administrator', 'new', 'studentCookie', true, 403],
      ['500 On empty username', null, 'administrator', 'new', 'administratorCookie', false, 500],
      ['500 On empty password', 'administrator', 'administrator', null, 'administratorCookie', false, 500],
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

  describe('POST /user/register', () => {
    const testAdministrator = {
      username: 'newAdministrator',
      password: 'password',
      role: 'administrator',
      fullname: 'fullname',
      address: 'address',
      matriculationNumber: 'newAdministrator',
      mail: 'newAdministrator@mail.mail',
    };
    const testTeacher = {
      username: 'newTeacher',
      password: 'password',
      role: 'teacher',
      fullname: 'fullname',
      address: 'address',
      matriculationNumber: 'newTeacher',
      mail: 'newTeacher@mail.mail',
    };
    const testStudent = {
      username: 'newStudent',
      password: 'password',
      role: 'student',
      fullname: 'fullname',
      address: 'address',
      matriculationNumber: 'newStudent',
      mail: 'newStudent@mail.mail',
    };
    const emptyUsername = {
      username: null,
      password: 'password',
      role: 'student',
      fullname: 'fullname',
      address: 'address',
      matriculationNumber: 'newStudent',
      mail: 'newStudent@mail.mail',
    };
    const emptyPassword = {
      username: 'newStudent',
      password: null,
      role: 'student',
      fullname: 'fullname',
      address: 'address',
      matriculationNumber: 'newStudent',
      mail: 'newStudent@mail.mail',
    };
    const emptyMatriculationNumber = {
      username: 'newStudent',
      password: 'password',
      role: 'student',
      fullname: 'fullname',
      address: 'address',
      matriculationNumber: null,
      mail: 'newStudent@mail.mail',
    };
    test.each([
      ['Successfull register administrator', testAdministrator, 'administratorCookie', true, 200],
      ['Successfull register teacher', testStudent, 'administratorCookie', true, 200],
      ['Successfull register student', testTeacher, 'administratorCookie', true, 200],
      ['500 Empty username', emptyUsername, 'administratorCookie', false, 500],
      ['500 Empty password', emptyPassword, 'administratorCookie', false, 500],
      ['500 Empty matriculationNumber', emptyMatriculationNumber, 'administratorCookie', false, 500],
      ['403 Teacher tries to register', testAdministrator, 'teacherCookie', false, 403],
      ['403 Student tries to register', testAdministrator, 'studentCookie', false, 403],
    ])('%s', async (msg, user, cookie, checkLogin, expected) => {
      const testCookie = global[cookie];
      const res = await helper.postAuth(registerPath, user, testCookie);
      expect(res.statusCode).toEqual(expected);
      if (checkLogin) {
        const testUser = {
          username: user.username,
          password: user.password,
        };
        const loginRes = await helper.postNoAuth(loginPath, testUser);
        expect(loginRes.statusCode).toEqual(expected);
        const decoded = await jwt.decode(loginRes.text);
        expect(decoded.username).toEqual(user.username);
        expect(decoded.role).toEqual(user.role);
      }
    });
  });

  describe('POST /user/delete', () => {
    test.each([
      ['Successfully delete a user', 'newAdministrator', 'administratorCookie', true, 200],
      ['403 teacher tries to delete', 'newAdministrator', 'teacherCookie', false, 403],
      ['403 student tries to delete', 'newAdministrator', 'studentCookie', false, 403],
      ['500 empty username', null, 'administratorCookie', false, 500],
    ])('%s', async (msg, username, cookie, checkLogin, expected) => {
      const testCookie = global[cookie];
      const testUser = { username };
      const res = await helper.postAuth(deletePath, testUser, testCookie);
      expect(res.statusCode).toEqual(expected);
      if (checkLogin) {
        const newTestUser = {
          username,
          password: 'password',
        };
        const loginRes = await helper.postNoAuth(loginPath, newTestUser);
        expect(loginRes.statusCode).toEqual(403);
      }
    });
  });
});
