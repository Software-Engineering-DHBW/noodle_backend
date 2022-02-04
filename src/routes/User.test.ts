// import { hash } from 'argon2';
import * as argon2 from 'argon2';
import { mocked } from 'jest-mock';
import User from '../entity/User';
import * as manager from './Manager';
import { changeUserPassword } from './User';

const mockRequest = (body) => ({
  body,
});

const mockResponse = () => {
  const res = { status: () => {}, send: () => {} };
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

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
    // hashSpy.mockReset();
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
