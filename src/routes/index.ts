import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import {
  registerUser, loginUser, deleteUser, changeUserPassword,
} from './User';

export const router: express.Router = express.Router();

router.use((req, res, next) => {
  try {
    if (!(req.originalUrl === '/user/login')) {
      req.session = jwt.verify(req.headers.authorization.split(' ')[1], process.env.jwtSignatureKey);
    }
    next();
  } catch (_err) {
    res.status(401).send('Invalid JWT');
  }
});

router.post('/user/register', (req, res) => {
  registerUser(req, res);
});

router.post('/user/login', (req, res) => {
  loginUser(req, res);
});

router.post('/user/delete', (req, res) => {
  deleteUser(req, res);
});

router.post('/user/changePassword', (req, res) => {
  changeUserPassword(req, res);
});
