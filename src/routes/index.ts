import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import {
  registerUser, loginUser, deleteUser, changeUserPassword, getAllUsers,
} from './User';
import {
  addCourse, changeSubmodule, changeTeacher, changeDescription, changeName,
  deleteModule, registerModule, removeCourse, selectModule,
} from './Module';
import {
  changeCourse, addStudent, removeStudent, deleteCourse, registerCourse, selectCourse,
} from './Course';
import { getGradesForStudent, insertGradeForStudent, deleteGradeForStudent } from './Grades';
import {
  deleteTimeTableEntriesModule,
  getTimeTableEntriesCourse, getTimeTableEntriesModule,
  getTimeTableEntriesPerson, insertTimetableEntry,
} from './TimeTable';
import { registerModuleItem, selectModuleItem } from './ModuleItem';

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

router.post('/module/:moduleId/changeName', (req: express.Request, res: express.Respone) => {
  changeName(req, res);
});

router.post('/module/:moduleId/changeSubmodule', (req: express.Request, res: express.Respone) => {
  changeSubmodule(req, res);
});

router.post('/module/:moduleId/changeDescription', (req: express.Request, res: express.Respone) => {
  changeDescription(req, res);
});

router.post('/module/:moduleId/removeCourse', (req: express.Request, res: express.Respone) => {
  removeCourse(req, res);
});

router.post('/module/:moduleId/addCourse', (req: express.Request, res: express.Respone) => {
  addCourse(req, res);
});

router.post('/module/:moduleId/changeTeacher', (req: express.Request, res: express.Respone) => {
  changeTeacher(req, res);
});
router.post('/module/:moduleId/deleteModule', (req: express.Request, res: express.Respone) => {
  deleteModule(req, res);
});

router.get('/module/:moduleId', (req: express.Request, res: express.Respone) => {
  selectModule(req, res);
});

// API Calls for ModuleItem
router.post('/module/:moduleId/addMouduleItem', (req: express.Request, res: express.Respone) => {
  registerModuleItem(req, res);
});

router.get('/module/:moduleId/:moduleItemId', (req: express.Request, res: express.Respone) => {
  selectModuleItem(req, res);
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
