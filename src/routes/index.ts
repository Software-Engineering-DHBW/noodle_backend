import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import {
  registerUser, loginUser, deleteUser, changeUserPassword, getAllUsers,
} from './User';
import {
  addCourse, addSubmodule, deleteSubmodule, addTeacher, deleteTeacher, changeDescription, changeName,
  deleteModule, registerModule, deleteCourse as removeCourse, selectModule,
} from './Module';
import {
  changeCourse, addStudent, deleteStudent, deleteCourse, registerCourse, selectCourse,
} from './Course';
import {
  getGradesForStudent, insertGradeForStudent, deleteGradeForStudent, getGradesForModule,
} from './Grades';
import {
  deleteTimeTableEntriesModule,
  getTimeTableEntriesCourse, getTimeTableEntriesModule,
  getTimeTableEntriesPerson, insertTimetableEntry,
} from './TimeTable';
import * as Permission from './PermissionCheck';
import { registerModuleItem, selectModuleItem } from './ModuleItem';

export interface JwtPayload {
  'id': number,
  'username': string,
  'fullName': string,
  'role': string,
  'exp': number
}

const administratorRole = 'administrator';
const teacherRole = 'teacher';
const studentRole = 'student';

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
  Permission.checkAdministrator(req, res, registerUser);
});

router.post('/user/login', (req: express.Request, res: express.Response) => {
  loginUser(req, res);
});

router.post('/user/delete', (req: express.Request, res: express.Response) => {
  Permission.checkAdministrator(req, res, deleteUser);
});

router.post('/user/changePassword', (req: express.Request, res: express.Response) => {
  Permission.checkAdministratorOrOwnUsername(req, res, changeUserPassword);
});

router.get('/user/getAll', (req: express.Request, res: express.Response) => {
  Permission.checkAdministrator(req, res, getAllUsers);
});

// API Calls for Module
router.post('/module/register', (req: express.Request, res: express.Response) => {
  Permission.checkAdministrator(req, res, registerModule);
});

router.post('/module/:moduleId/changeName', (req: express.Request, res: express.Respone) => {
  Permission.checkAdministrator(req, res, changeName);
});

router.post('/module/:moduleId/addSubmodule', (req: express.Request, res: express.Respone) => {
  Permission.checkAdministrator(req, res, addSubmodule);
});

router.post('/module/:moduleId/deleteSubmodule', (req: express.Request, res: express.Respone) => {
  Permission.checkAdministrator(req, res, deleteSubmodule);
});

router.post('/module/:moduleId/changeDescription', (req: express.Request, res: express.Respone) => {
  Permission.checkAdministrator(req, res, changeDescription);
});

router.post('/module/:moduleId/deleteCourse', (req: express.Request, res: express.Respone) => {
  removeCourse(req, res);
});

router.post('/module/:moduleId/addCourse', (req: express.Request, res: express.Respone) => {
  Permission.checkAdministrator(req, res, addCourse);
});

router.post('/module/:moduleId/addTeacher', (req: express.Request, res: express.Respone) => {
  Permission.checkAdministrator(req, res, addTeacher);
});

router.post('/module/:moduleId/deleteTeacher', (req: express.Request, res: express.Respone) => {
  Permission.checkAdministrator(req, res, deleteTeacher);
});

router.post('/module/:moduleId/deleteModule', (req: express.Request, res: express.Respone) => {
  Permission.checkAdministrator(req, res, deleteModule);
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
  Permission.checkAdministrator(req, res, changeCourse);
});

router.post('/course/register', (req: express.Request, res: express.Response) => {
  Permission.checkAdministrator(req, res, registerCourse);
});

router.post('/course/:courseId/delete', (req: express.Request, res: express.Response) => {
  Permission.checkAdministrator(req, res, deleteCourse);
});

router.post('/course/:courseId/addStudent', (req: express.Request, res: express.Response) => {
  Permission.checkAdministrator(req, res, addStudent);
});

router.post('/course/:courseId/deleteStudent', (req: express.Request, res: express.Response) => {
  Permission.checkAdministrator(req, res, deleteStudent);
});

// API Calls for Grades
router.get('/grades/:studentId', (req: express.Request, res: express.Response) => {
  req.body.id = parseInt(req.params.studentId, 10);
  Permission.checkAdministratorOrOwnID(req, res, getGradesForStudent);
});

router.get('/grades/module/:moduleId', (req: express.Request, res: express.Response) => {
  Permission.checkAdministratorOrModuleTeacher(req, res, getGradesForModule);
});

router.post('/grades/insert', (req: express.Request, res: express.Response) => {
  Permission.checkAdministratorOrModuleTeacher(req, res, insertGradeForStudent);
});

router.post('/grades/delete', (req: express.Request, res: express.Response) => {
  Permission.checkAdministratorOrModuleTeacher(req, res, deleteGradeForStudent);
});

// API Calls for Timetable
router.post('/timetable/insert', (req: express.Request, res: express.Response) => {
  Permission.checkAdministratorOrModuleTeacher(req, res, insertTimetableEntry);
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
  Permission.checkAdministratorOrModuleTeacher(req, res, deleteTimeTableEntriesModule);
});

export default router;
