import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import User from '../entity/User';
import {
  registerUser, loginUser, deleteUser, changeUserPassword, getAllUsers,
} from './User';
import { registerModule } from './Module';
import {
  addStudent, changeCourse, deleteCourse, registerCourse, removeStudent, selectCourse,
} from './Course';
import { getGradesForStudent, insertGradeForStudent, deleteGradeForStudent } from './Grades';

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

router.post('/module/register', (req: express.Request, res: express.Response) => {
  registerModule(req, res);
});

router.get('/course/selectCourse', (req: express.Request, res: express.Response) => {
  selectCourse(req, res);
});

router.post('/course/changeCourse', (req: express.Request, res: express.Response) => {
  changeCourse(req, res);
});

router.post('/course/register', (req: express.Request, res: express.Response) => {
  registerCourse(req, res);
});

router.post('/course/delete', (req: express.Request, res: express.Response) => {
  deleteCourse(req, res);
});

router.post('/course/addStudent', (req: express.Request, res: express.Response) => {
  addStudent(req, res);
});

router.post('/course/removeStudent', (req: express.Request, res: express.Response) => {
  removeStudent(req, res);
});

router.get('/grades/:studentId', (req: express.Request, res: express.Response) => {
  getGradesForStudent(req, res);
});

router.post('/grades/insert', (req: express.Request, res: express.Response) => {
  insertGradeForStudent(req, res);
});

router.post('/grades/delete', (req: express.Request, res: express.Response) => {
  deleteGradeForStudent(req, res);
});

export default router;
