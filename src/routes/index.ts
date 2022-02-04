import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import {
  registerUser, loginUser, deleteUser, changeUserPassword, getAllUsers,
} from './User';
import {
  addCourse, addModuleItem, addSubmodule, addTeacher, changeDescription, changeName, deleteModule, deleteSubmodule,
  deleteTeacher, registerModule, removeCourse,
} from './Module';
import {
  addStudent, changeCourse, deleteCourse, registerCourse, removeStudent, selectCourse,
} from './Course';
import { getGradesForStudent, insertGradeForStudent, deleteGradeForStudent } from './Grades';
import {
  deleteTimeTableEntriesModule,
  getTimeTableEntriesCourse, getTimeTableEntriesModule,
  getTimeTableEntriesPerson, insertTimetableEntry,
} from './TimeTable';

interface JwtPayload {
  'id': number,
  'username': string,
  'fullName': string,
  'role': string,
  'exp': number
}
const router: express.Router = express.Router();

router.use((req: express.Request, res: express.Response, next: express.Next) => {
  try {
    if (!(req.originalUrl === '/user/login')) {
      const jwtPayload: JwtPayload = jwt.verify(req.headers.authorization.split(' ')[1], process.env.jwtSignatureKey);
      req.session = jwtPayload;
    }
    next();
  } catch (_err) {
    res.status(401).send('Invalid JWT');
  }
});

// API Calls for User
router.post('/user/register', (req: express.Request, res: express.Response) => {
  registerUser(req, res);
});

router.post('/user/login', (req: express.Request, res: express.Response) => {
  loginUser(req, res);
});

router.post('/user/delete', (req: express.Request, res: express.Response) => {
  deleteUser(req, res);
});

router.post('/user/changePassword', (req: express.Request, res: express.Response) => {
  changeUserPassword(req, res);
});

router.get('/user/getAll', (req: express.Request, res: express.Response) => {
  getAllUsers(req, res);
});

// API Calls for Module
router.post('/module/register', (req: express.Request, res: express.Response) => {
  registerModule(req, res);
});

router.post('/module/changeName', (req: express.Request, res: express.Respone) => {
  changeName(req, res);
});

router.post('/module/deleteSubmodule', (req: express.Request, res: express.Respone) => {
  deleteSubmodule(req, res);
});

router.post('/module/addSubmodule', (req: express.Request, res: express.Respone) => {
  addSubmodule(req, res);
});

router.post('/module/changeDescription', (req: express.Request, res: express.Respone) => {
  changeDescription(req, res);
});

router.post('/module/removeCourse', (req: express.Request, res: express.Respone) => {
  removeCourse(req, res);
});

router.post('/module/addCourse', (req: express.Request, res: express.Respone) => {
  addCourse(req, res);
});

router.post('/module/deleteTeacher', (req: express.Request, res: express.Respone) => {
  deleteTeacher(req, res);
});

router.post('/module/addTeacher', (req: express.Request, res: express.Respone) => {
  addTeacher(req, res);
});

router.post('/module/deleteModule', (req: express.Request, res: express.Respone) => {
  deleteModule(req, res);
});

router.post('/module/:moduleId/addMoudulItem', (req: express.Request, res: express.Respone) => {
  addModuleItem(req, res);
});

// API Calls for Course
router.get('/course/:courseId', (req: express.Request, res: express.Response) => {
  selectCourse(req, res);
});

router.post('/course/:courseId/changeCourse', (req: express.Request, res: express.Response) => {
  changeCourse(req, res);
});

router.post('/course/register', (req: express.Request, res: express.Response) => {
  registerCourse(req, res);
});

router.post('/course/:courseId/delete', (req: express.Request, res: express.Response) => {
  deleteCourse(req, res);
});

router.post('/course/:courseId/addStudent', (req: express.Request, res: express.Response) => {
  addStudent(req, res);
});

router.post('/course/:courseId/removeStudent', (req: express.Request, res: express.Response) => {
  removeStudent(req, res);
});

// API Calls for Grades
router.get('/grades/:studentId', (req: express.Request, res: express.Response) => {
  getGradesForStudent(req, res);
});

router.post('/grades/insert', (req: express.Request, res: express.Response) => {
  insertGradeForStudent(req, res);
});

router.post('/grades/delete', (req: express.Request, res: express.Response) => {
  deleteGradeForStudent(req, res);
});

// API Calls for Timetable
router.post('/timetable/insert', (req: express.Request, res: express.Response) => {
  insertTimetableEntry(req, res);
});

router.get('/timetable/getPerson', (req: express.Request, res: express.Response) => {
  getTimeTableEntriesPerson(req, res);
});

router.get('/timetable/getModule/:moduleId', (req: express.Request, res: express.Response) => {
  getTimeTableEntriesModule(req, res);
});

router.get('/timetable/getCourse/:courseId', (req: express.Request, res: express.Response) => {
  getTimeTableEntriesCourse(req, res);
});

router.post('/timetable/delete', (req: express.Request, res: express.Response) => {
  deleteTimeTableEntriesModule(req, res);
});

export default router;
