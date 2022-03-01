import * as helper from './helper';

const generalPath = '/timetable';
const insertPath = `${generalPath}/insert`;
const getPersonPath = `${generalPath}/getPerson`;
const getModulePath = `${generalPath}/getModule`;
const getCoursePath = `${generalPath}/getCourse`;
const deletePath = `${generalPath}/delete`;

describe('/timetable', () => {
  describe('GET /timetable/getPerson', () => {
    test.each([
      ['200 Successfull student', 'studentCookie', 200],
      ['200 Successfull teacher', 'teacherCookie', 200],
    ])('%s', async (msg, cookie, expected) => {
      const res = await helper.getAuth(getPersonPath, global[cookie]);
    });
  });
});
