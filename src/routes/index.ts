import * as express from 'express';
import * as jwt from 'jsonwebtoken'; import * as user from './User';
import * as module from './Module';
import * as course from './Course';
import * as grades from './Grades';
import * as time from './TimeTable';
import * as Permission from './PermissionCheck';
import * as moduleItem from './ModuleItem';

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
  Permission.checkAdministrator(req, res, user.registerUser);
});

router.post('/user/login', (req: express.Request, res: express.Response) => {
  user.loginUser(req, res);
});

router.post('/user/delete', (req: express.Request, res: express.Response) => {
  Permission.checkAdministrator(req, res, user.deleteUser);
});

router.post('/user/changePassword', (req: express.Request, res: express.Response) => {
  Permission.checkAdministratorOrOwnUsername(req, res, user.changeUserPassword);
});

router.get('/user/getAll', (req: express.Request, res: express.Response) => {
  Permission.checkAdministrator(req, res, user.getAllUsers);
});

// API Calls for Module
router.post('/module/register', (req: express.Request, res: express.Response) => {
  Permission.checkAdministrator(req, res, module.registerModule);
});

router.post('/module/:moduleId/changeName', (req: express.Request, res: express.Respone) => {
  Permission.checkAdministrator(req, res, module.changeName);
});

router.post('/module/:moduleId/addSubmodule', (req: express.Request, res: express.Respone) => {
  Permission.checkAdministrator(req, res, module.addSubmodule);
});

router.post('/module/:moduleId/deleteSubmodule', (req: express.Request, res: express.Respone) => {
  Permission.checkAdministrator(req, res, module.deleteSubmodule);
});

router.post('/module/:moduleId/changeDescription', (req: express.Request, res: express.Respone) => {
  Permission.checkAdministrator(req, res, module.changeDescription);
});

router.post('/module/:moduleId/deleteCourse', (req: express.Request, res: express.Respone) => {
  Permission.checkAdministrator(req, res, module.deleteCourse);
});

router.post('/module/:moduleId/addCourse', (req: express.Request, res: express.Respone) => {
  Permission.checkAdministrator(req, res, module.addCourse);
});

router.post('/module/:moduleId/addTeacher', (req: express.Request, res: express.Respone) => {
  Permission.checkAdministrator(req, res, module.addTeacher);
});

router.post('/module/:moduleId/deleteTeacher', (req: express.Request, res: express.Respone) => {
  Permission.checkAdministrator(req, res, module.deleteTeacher);
});

router.post('/module/:moduleId/deleteModule', (req: express.Request, res: express.Respone) => {
  Permission.checkAdministrator(req, res, module.deleteModule);
});

router.get('/module/getModules', (req: express.Request, res: express.Response) => {
  module.getModules(req, res);
});

router.get('/module/getAllModules', (req: express.Request, res: express.Response) => {
  Permission.checkAdministrator(req, res, module.getAllModules);
});

router.get('/module/:moduleId', (req: express.Request, res: express.Respone) => {
  module.selectModule(req, res);
});

router.get('/module/:moduleId/getStudents', (req: express.Request, res: express.Respone) => {
  module.getStudents(req, res);
});

// API Calls for ModuleItem
router.post('/module/:moduleId/addMouduleItem', (req: express.Request, res: express.Respone) => {
  Permission.checkAdministratorOrModuleTeacher(req, res, moduleItem.registerModuleItem);
});

router.get('/module/:moduleId/:moduleItemId/select', (req: express.Request, res: express.Respone) => {
  moduleItem.selectModuleItem(req, res);
});

router.get('/module/:moduleId/selectModuleItems', (req: express.Request, res: express.Respone) => {
  moduleItem.selectAllModuleItems(req, res);
});

router.get('/module/:moduleId/:moduleItemId/changeModuleItem', (req: express.Request, res: express.Respone) => {
  Permission.checkAdministratorOrModuleTeacher(req, res, moduleItem.changeModuleItem);
});

router.post('/module/:moduleId/:moduleItemId/deleteModuleItem', (req: express.Request, res: express.Respone) => {
  Permission.checkAdministratorOrModuleTeacher(req, res, moduleItem.deleteModuleItem);
});

router.post('/module/:moduleId/deleteAllModuleItems', (req: express.Request, res: express.Respone) => {
  Permission.checkAdministratorOrModuleTeacher(req, res, moduleItem.deleteAllModuleItems);
});

router.post('/module/:moduleId/:moduleItemId/addDownloadFile', (req: express.Request, res: express.Respone) => {
  Permission.checkAdministratorOrModuleTeacher(req, res, moduleItem.addDownloadFile);
});

router.post('/module/:moduleId/:moduleItemId/deleteFile', (req: express.Request, res: express.Respone) => {
  Permission.checkAdministratorOrModuleTeacher(req, res, moduleItem.deleteDownloadFile);
});

router.post('/module/:moduleId/:moduleItemId/uploadFile', (req: express.Request, res: express.Respone) => {
  moduleItem.uploadFile(req, res);
});

router.post('/module/:moduleId/:moduleItemId/deleteUploadedFile', (req: express.Request, res: express.Respone) => {
  Permission.checkAdministratorOrOwnID(req, res, moduleItem.deleteUploadedFile);
});

router.post('/module/:moduleId/:moduleItemId/deleteAllUploadedFiles', (req: express.Request, res: express.Respone) => {
  Permission.checkAdministratorOrModuleTeacher(req, res, moduleItem.deleteAllUploadedFiles);
});

// API Calls for Course
router.get('/course/getAll', (req: express.Request, res: express.Response) => {
  Permission.checkAdministrator(req, res, course.getAllCourses);
});

router.get('/course/:courseId', (req: express.Request, res: express.Response) => {
  course.selectCourse(req, res);
});

router.post('/course/:courseId/changeCourse', (req: express.Request, res: express.Response) => {
  Permission.checkAdministrator(req, res, course.changeCourse);
});

router.post('/course/register', (req: express.Request, res: express.Response) => {
  Permission.checkAdministrator(req, res, course.registerCourse);
});

router.post('/course/:courseId/delete', (req: express.Request, res: express.Response) => {
  Permission.checkAdministrator(req, res, course.deleteCourse);
});

router.post('/course/:courseId/addStudent', (req: express.Request, res: express.Response) => {
  Permission.checkAdministrator(req, res, course.addStudent);
});

router.post('/course/:courseId/deleteStudent', (req: express.Request, res: express.Response) => {
  Permission.checkAdministrator(req, res, course.deleteStudent);
});

// API Calls for Grades
router.get('/grades/:studentId', (req: express.Request, res: express.Response) => {
  req.body.id = parseInt(req.params.studentId, 10);
  Permission.checkAdministratorOrOwnID(req, res, grades.getGradesForStudent);
});

router.get('/grades/module/:moduleId', (req: express.Request, res: express.Response) => {
  Permission.checkAdministratorOrModuleTeacher(req, res, grades.getGradesForModule);
});

router.post('/grades/insert', (req: express.Request, res: express.Response) => {
  req.params.moduleId = req.body.moduleId;
  Permission.checkAdministratorOrModuleTeacher(req, res, grades.insertGradeForStudent);
});

router.post('/grades/delete', (req: express.Request, res: express.Response) => {
  req.params.moduleId = req.body.moduleId;
  Permission.checkAdministratorOrModuleTeacher(req, res, grades.deleteGradeForStudent);
});

// API Calls for Timetable
router.post('/timetable/insert', (req: express.Request, res: express.Response) => {
  Permission.checkAdministratorOrModuleTeacher(req, res, time.insertTimetableEntry);
});

router.get('/timetable/getPerson', (req: express.Request, res: express.Response) => {
  time.getTimeTableEntriesPerson(req, res);
});

router.get('/timetable/getModule/:moduleId', (req: express.Request, res: express.Response) => {
  time.getTimeTableEntriesModule(req, res);
});

router.get('/timetable/getCourse/:courseId', (req: express.Request, res: express.Response) => {
  time.getTimeTableEntriesCourse(req, res);
});

router.post('/timetable/delete', (req: express.Request, res: express.Response) => {
  Permission.checkAdministratorOrModuleTeacher(req, res, time.deleteTimeTableEntriesModule);
});

export default router;
