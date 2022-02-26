import * as helper from './helper';

const generalPath = '/grades';
const getStudentPath = `${generalPath}`;
const getModulePath = `${generalPath}/module`;
const insertPath = `${generalPath}/insert`;
const deletePath = `${generalPath}/delete`;

const correctGrade = (responseGrades, newGrade) => responseGrades.some(
  (element) => element.grade === newGrade.grade
  && element.studentId.id === newGrade.studentId,
);

describe('/grades', () => {
  describe('GET /grades/:studentId', () => {
    test.each([
      ['200 Student own grades', '4', 'studentCookie', 200],
      ['200 Administrator any grades', '4', 'administratorCookie', 200],
      ['403 Student not own grades', '5', 'studentCookie', 403],
      ['403 Teacher any grades', '4', 'teacherCookie', 403],
      ['403 Empty id studentCookie', null, 'studentCookie', 403],
      ['500 Empty id administratorCookie', null, 'administratorCookie', 500],
    ])('%s', async (msg, studentId, cookie, expected) => {
      const res = await helper.getAuth(`${getStudentPath}/${studentId}`, global[cookie]);
      expect(res.statusCode).toEqual(expected);
    });
  });

  describe('GET /grades/module/:moduleId', () => {
    test.each([
      ['200 Teacher own module', '1', 'teacherCookie', 200],
      ['200 administator', '1', 'administratorCookie', 200],
      ['403 teacher not own module', '2', 'teacherCookie', 403],
      ['403 student tries to access', '1', 'studentCookie', 403],
      ['403 teacher empty id', null, 'teacherCookie', 403],
      ['500 administator empty id', null, 'administratorCookie', 500],
    ])('%s', async (msg, moduleId, cookie, expected) => {
      const res = await helper.getAuth(`${getModulePath}/${moduleId}`, global[cookie]);
      expect(res.statusCode).toEqual(expected);
    });
  });

  describe('POST /grades/insert', () => {
    test.each([
      ['200 administator insert', 1, 1, 1, true, 'administratorCookie', 200],
      ['200 teacher own module insert', 1, 1, 1, true, 'teacherCookie', 200],
      ['403 teacher not own module insert', 2, 1, 1, false, 'teacherCookie', 403],
      ['403 student insert', 1, 1, 4, false, 'studentCookie', 403],
      ['500 missing studentId', 1, null, 5, false, 'administratorCookie', 500],
      ['500 missing moduleId', null, 1, 6, false, 'administratorCookie', 500],
      ['500 missing grade', 1, 1, null, false, 'administratorCookie', 500],
    ])('%s', async (msg, moduleId, studentId, grade, checkInsert, cookie, expected) => {
      const newGrade = {
        moduleId,
        studentId,
        grade,
        weight: 100,
      };
      const res = await helper.postAuth(`${insertPath}`, newGrade, global[cookie]);
      expect(res.statusCode).toEqual(expected);
      const checkRes = await helper.getAuth(`${getModulePath}/${newGrade.moduleId}`, global.administratorCookie);
      const foundGrades = checkRes.body;
      let foundNewGrade = false;
      try {
        foundNewGrade = correctGrade(foundGrades, newGrade);
      } catch (_err) {
        foundNewGrade = false;
      } finally {
        expect(foundNewGrade).toEqual(checkInsert);
      }
    });
  });

  describe('POST /grades/delete', () => {
    test.each([
      ['200 administator delete', 1, 1, 1, 'administratorCookie', 200],
      ['200 teacher own module delete', 1, 3, 1, 'teacherCookie', 200],
      ['403 teacher not own module delete', 2, 1, 1, 'teacherCookie', 403],
      ['403 student delete', 1, 1, 4, 'studentCookie', 403],
      ['500 missing studentId', 1, null, 5, 'administratorCookie', 500],
      ['500 missing moduleId', null, 1, 6, 'administratorCookie', 500],
      ['500 missing grade', 1, 1, null, 'administratorCookie', 500],
    ])('%s', async (msg, moduleId, studentId, grade, cookie, expected) => {
      const newGrade = {
        moduleId,
        studentId,
        grade,
        weight: 100,
      };
      const res = await helper.postAuth(`${deletePath}`, newGrade, global[cookie]);
      expect(res.statusCode).toEqual(expected);
      const checkRes = await helper.getAuth(`${getModulePath}/${newGrade.moduleId}`, global.administratorCookie);
      const foundGrades = checkRes.body;
      let foundNewGrade = false;
      try {
        foundNewGrade = correctGrade(foundGrades, newGrade);
      } catch (_err) {
        foundNewGrade = false;
      } finally {
        expect(foundNewGrade).toEqual(false);
      }
    });
  });
});
