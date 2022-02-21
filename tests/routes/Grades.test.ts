import { mocked } from 'jest-mock';
import * as manager from '../../src/routes/Manager';
import { mockResponse, mockRequest } from '../helpers/HttpObjects';
import * as grades from '../../src/routes/Grades';
import Grades from '../../src/entity/Grades';
import UserDetail from '../../src/entity/UserDetail';

describe('Tests for inserting a Grade for a student', () => {
  beforeEach(() => {
    jest.spyOn(manager, 'saveObject');
  });

  test('Successfull insert a grade', async () => {
    const testGrade = {
      id: 1,
      moduleId: 1,
      studentId: 1,
      grade: 1,
      weight: 100,
    };
    const req = mockRequest(testGrade);
    const res = mockResponse();
    mocked(manager.saveObject).mockImplementationOnce(async (obj, objClass) => {});
    await grades.insertGradeForStudent(req, res);
    expect(manager.saveObject).toHaveBeenCalledWith(testGrade, Grades);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('HTTP-Status 500 if a error occurs', async () => {
    const testGrade = {
      weight: 100,
    };
    const req = mockRequest(testGrade);
    const res = mockResponse();
    mocked(manager.saveObject).mockImplementationOnce(async (obj, objClass) => {
      throw new Error('');
    });
    await grades.insertGradeForStudent(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe('Get grades for a student', () => {
  beforeEach(() => {
    jest.spyOn(manager, 'getObjects');
  });

  test('Successfull get the grades for a student', async () => {
    const returnGrades = [
      {
        grade: 3,
        weight: 100,
        moduleId: {
          id: 1,
          name: 'Test',
          description: 'Test',
        },
      },
    ];
    const queryParams = {
      select: ['grade', 'weight'],
      where: { studentId: 1 },
      relations: ['moduleId'],
    };
    const req = mockRequest({});
    req.params = { studentId: 1 };
    const res = mockResponse();
    mocked(manager.getObjects).mockImplementationOnce(async (obj, objClass) => returnGrades);
    await grades.getGradesForStudent(req, res);
    expect(manager.getObjects).toHaveBeenCalledWith(queryParams, Grades);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(returnGrades);
  });

  test('HTTP-Status 500 if a error occurs', async () => {
    const req = mockRequest({});
    req.params = { studentId: 1 };
    const res = mockResponse();
    mocked(manager.getObjects).mockImplementationOnce(async (obj, objClass) => {
      throw new Error('');
    });
    await grades.getGradesForStudent(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(500);
  });
});

describe('Get grades for a module', () => {
  beforeEach(() => {
    jest.spyOn(manager, 'getObjects');
    jest.spyOn(manager, 'getOneObject');
  });

  test('Successfull get the grades for a student', async () => {
    const queryReturns = [
      {
        id: 1,
        grade: 3,
        weight: 100,
        studentId: {
          id: 1,
          username: 'student',
          password: 'student',
          isAdministrator: 1,
          isTeacher: 1,
        },
      },
    ];
    const studentDetailsReturn = {
      fullname: 'fullname',
      matriculationNumber: 'matriculationNumber',
    };
    const returnGrades = [
      {
        id: 1,
        grade: 3,
        weight: 100,
        studentId: {
          id: 1,
          username: 'student',
        },
        studentDetails: {
          fullname: 'fullname',
          matriculationNumber: 'matriculationNumber',
        },
      },
    ];
    const queryParamsGrades = {
      where: { moduleId: 1 },
      relations: ['studentId'],
    };
    const queryParamsStudentDetails = {
      select: ['fullname', 'matriculationNumber'],
      where: {
        userId: {
          id: 1,
          username: 'student',
        },
      },
    };
    const req = mockRequest({});
    req.params = { moduleId: 1 };
    const res = mockResponse();
    mocked(manager.getOneObject).mockImplementationOnce(async (obj, objClass) => studentDetailsReturn);
    mocked(manager.getObjects).mockImplementationOnce(async (obj, objClass) => queryReturns);
    await grades.getGradesForModule(req, res);
    expect(manager.getObjects).toHaveBeenCalledWith(queryParamsGrades, Grades);
    expect(manager.getOneObject).toHaveBeenCalledWith(queryParamsStudentDetails, UserDetail);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(returnGrades);
  });

  test('HTTP-Status 500 if a error occurs while getting the grades', async () => {
    const req = mockRequest({});
    req.params = { moduleId: 1 };
    const res = mockResponse();
    mocked(manager.getObjects).mockImplementationOnce(async (obj, objClass) => {
      throw new Error('');
    });
    await grades.getGradesForModule(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(500);
  });

  test('HTTP-Status 500 if a error occurs while getting the user details', async () => {
    const queryReturns = [
      {
        id: 1,
        grade: 3,
        weight: 100,
        studentId: {
          id: 1,
          username: 'student',
          password: 'student',
          isAdministrator: 1,
          isTeacher: 1,
        },
      },
    ];
    const req = mockRequest({});
    req.params = { studentId: 1 };
    const res = mockResponse();
    mocked(manager.getObjects).mockImplementationOnce(async (obj, objClass) => queryReturns);
    mocked(manager.getOneObject).mockImplementationOnce(async (obj, objClass) => { throw new Error(''); });
    await grades.getGradesForModule(req, res);
    expect(res.sendStatus).toHaveBeenCalledWith(500);
  });
});

describe('Delete a grade', () => {
  beforeEach(() => {
    jest.spyOn(manager, 'deleteObjects');
  });

  test('Successfull delete a grade', async () => {
    const testGrade = {
      id: 1,
      moduleId: 1,
      studentId: 1,
      grade: 1,
      weight: 100,
    };
    const req = mockRequest(testGrade);
    const res = mockResponse();
    mocked(manager.deleteObjects).mockImplementationOnce(async (obj, objClass) => {});
    await grades.deleteGradeForStudent(req, res);
    expect(manager.deleteObjects).toHaveBeenCalledWith(testGrade, Grades);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test('HTTP-Status 500 if a error occurs while deleting a grade', async () => {
    const req = mockRequest({});
    const res = mockResponse();
    mocked(manager.deleteObjects).mockImplementationOnce(async (obj, objClass) => {
      throw new Error('');
    });
    await grades.deleteGradeForStudent(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});
