// import { hash } from 'argon2';
import * as argon2 from 'argon2';
import { mocked } from 'jest-mock';
import * as jwt from 'jsonwebtoken';
import User from '../../src/entity/User';
import UserDetail from '../../src/entity/UserDetail';
import * as manager from '../../src/routes/Manager';
import { changeUserPassword, deleteUser, loginUser } from '../../src/routes/User';
import { mockResponse, mockRequest } from '../helpers/HttpObjects';

describe('Test for changing a password', () => {
  beforeEach(() => {
    jest.spyOn(manager, 'getOneObject');
    jest.spyOn(manager, 'saveObject');
    jest.spyOn(argon2, 'hash');
  });

  test('Successfull change the password', async () => {
    const testUser = { username: 'test', password: 'test' };
    const req = mockRequest(testUser);
    const res = mockResponse();
    mocked(manager.getOneObject).mockImplementationOnce(async (obj, objClass) => testUser);
    mocked(manager.saveObject).mockImplementationOnce(async (obj, objClass) => {});
    mocked(argon2.hash).mockImplementationOnce(async (password: string) => password.split('').reverse().join(''));
    await changeUserPassword(req, res);
    expect(manager.getOneObject).toHaveBeenCalledWith({ where: { username: 'test' } }, User);
    expect(argon2.hash).toHaveBeenCalledWith('test');
    expect(manager.saveObject).toHaveBeenCalledWith({ username: 'test', password: 'tset' }, User);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith('The password has been changed');
  });

  test('Fail on empty username', async () => {
    const testUser = { username: null, password: 'test' };
    const req = mockRequest(testUser);
    const res = mockResponse();
    await changeUserPassword(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Password could not be changed');
  });

  test('Fail on empty password', async () => {
    const testUser = { username: 'test', password: null };
    const req = mockRequest(testUser);
    const res = mockResponse();
    mocked(manager.getOneObject).mockImplementationOnce(async (obj, objClass) => testUser);
    await changeUserPassword(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('Password could not be changed');
  });
});

describe('Tests for deleting a user', () => {
  beforeEach(() => {
    jest.spyOn(manager, 'deleteObjects');
    jest.spyOn(manager, 'getOneObject');
  });

  test('Successfull delete a user', async () => {
    const testUser = { username: 'testUser' };
    const req = mockRequest(testUser);
    const res = mockResponse();
    mocked(manager.getOneObject).mockImplementationOnce(async (obj, objClass) => testUser);
    mocked(manager.deleteObjects).mockImplementationOnce(async (obj, objClass) => {});
    mocked(manager.deleteObjects).mockImplementationOnce(async (obj, objClass) => {});
    await deleteUser(req, res);
    expect(manager.getOneObject).toHaveBeenCalledWith({ where: { username: testUser.username } }, User);
    expect(manager.deleteObjects).toHaveBeenCalledWith({ userId: testUser }, UserDetail);
    expect(manager.deleteObjects).toHaveBeenCalledWith(testUser, User);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith('The user has been deleted');
  });

  test('Fail on empty username', async () => {
    const testUser = { username: null };
    const req = mockRequest(testUser);
    const res = mockResponse();
    await (deleteUser(req, res));
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith('The user could not be deleted');
  });
});

describe('Tests for a user login', () => {
  beforeEach(() => {
    jest.spyOn(manager, 'getOneObject');
    jest.spyOn(jwt, 'sign');
    jest.spyOn(argon2, 'verify');
    mocked(argon2.verify).mockImplementationOnce(async (passwd1, passwd2) => (passwd1 === passwd2));
  });

  test('Successfull login a user', async () => {
    const testUser = { id: 1, username: 'test', password: 'test' };
    const testJwtObject = {
      id: 1,
      username: 'test',
      fullName: 'test',
      role: 'student',
      exp: (12 * 60 * 60),
    };
    const req = mockRequest(testUser);
    const res = mockResponse();
    mocked(manager.getOneObject).mockImplementationOnce(async (obj, objClass) => testUser);
    mocked(manager.getOneObject).mockImplementationOnce(async (obj, objClass) => ({ fullname: 'test' }));
    mocked(jwt.sign).mockImplementationOnce(async (obj, key) => ({ id: obj.id, username: obj.username }));
    await loginUser(req, res);
    expect(manager.getOneObject).toHaveBeenCalledWith({ where: { username: testUser.username } }, User);
    expect(manager.getOneObject).toHaveBeenCalledWith({ where: { userId: testUser } }, UserDetail);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ id: testUser.id, username: testUser.username });
  });

  test('Successfull login a teacher', async () => {
    const testUser = {
      id: 1, username: 'test', password: 'test', isTeacher: true,
    };
    const testJwtObject = {
      id: 1,
      username: 'test',
      fullName: 'test',
      role: 'student',
      exp: (12 * 60 * 60),
    };
    const req = mockRequest(testUser);
    const res = mockResponse();
    mocked(manager.getOneObject).mockImplementationOnce(async (obj, objClass) => testUser);
    mocked(manager.getOneObject).mockImplementationOnce(async (obj, objClass) => ({ fullname: 'test' }));
    mocked(jwt.sign).mockImplementationOnce(async (obj, key) => ({ id: obj.id, username: obj.username, role: obj.role }));
    await loginUser(req, res);
    expect(manager.getOneObject).toHaveBeenCalledWith({ where: { username: testUser.username } }, User);
    expect(manager.getOneObject).toHaveBeenCalledWith({ where: { userId: testUser } }, UserDetail);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ id: testUser.id, username: testUser.username, role: 'teacher' });
  });

  test('Successfull login a administrator', async () => {
    const testUser = {
      id: 1, username: 'test', password: 'test', isAdministrator: true,
    };
    const testJwtObject = {
      id: 1,
      username: 'test',
      fullName: 'test',
      role: 'student',
      exp: (12 * 60 * 60),
    };
    const req = mockRequest(testUser);
    const res = mockResponse();
    mocked(manager.getOneObject).mockImplementationOnce(async (obj, objClass) => testUser);
    mocked(manager.getOneObject).mockImplementationOnce(async (obj, objClass) => ({ fullname: 'test' }));
    mocked(jwt.sign).mockImplementationOnce(async (obj, key) => ({ id: obj.id, username: obj.username, role: obj.role }));
    await loginUser(req, res);
    expect(manager.getOneObject).toHaveBeenCalledWith({ where: { username: testUser.username } }, User);
    expect(manager.getOneObject).toHaveBeenCalledWith({ where: { userId: testUser } }, UserDetail);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({ id: testUser.id, username: testUser.username, role: 'administrator' });
  });

  test('Fail on wrong password', async () => {
    const testUser = { id: 1, username: 'test', password: 'test' };
    const req = mockRequest(testUser);
    const res = mockResponse();
    mocked(manager.getOneObject).mockImplementationOnce(async (obj, objClass) => ({ username: 'test', password: 'tset' }));
    await loginUser(req, res);
    expect(manager.getOneObject).toHaveBeenCalledWith({ where: { username: testUser.username } }, User);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith('Wrong username or password');
  });

  test('Fail on empty password', async () => {
    const testUser = { id: 1, username: 'test', password: null };
    const req = mockRequest(testUser);
    const res = mockResponse();
    mocked(manager.getOneObject).mockImplementationOnce(async (obj, objClass) => ({ username: 'test', password: 'tset' }));
    await loginUser(req, res);
    expect(manager.getOneObject).toHaveBeenCalledWith({ where: { username: testUser.username } }, User);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith('Wrong username or password');
  });

  test('Fail on empty username', async () => {
    const testUser = { id: 1, username: null, password: 'test' };
    const req = mockRequest(testUser);
    const res = mockResponse();
    await loginUser(req, res);
    expect(manager.getOneObject).toHaveBeenCalledWith({ where: { username: testUser.username } }, User);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith('Wrong username or password');
  });
});

describe('Test for registering a new user', () => {

});
