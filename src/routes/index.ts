import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import {
  registerUser, loginUser, deleteUser, changeUserPassword,
} from './User';
import { registerModule } from './Module';
import {
  addStudent, registerCourse,
} from './course';

const router: express.Router = express.Router();

router.use((req: express.Request, res: express.Response, next: express.Next) => {
  try {
    if (!(req.originalUrl === '/user/login')) {
      req.session = jwt.verify(req.headers.authorization.split(' ')[1], process.env.jwtSignatureKey);
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

router.post('/module/register', (req: express.Request, res: express.Response) => {
  registerModule(req, res);
});

router.post('/course/register', (req: express.Request, res: express.Response) => {
  registerCourse(req, res);
});

router.post('/course/addStudent', (req: express.Request, res: express.Response) => {
  addStudent(req, res);
});

export default router;
