import * as express from "express";
import * as jwt from "jsonwebtoken";
import {register_user, login_user, delete_user, change_user_password} from "./User";

export const router: express.Router = express.Router();

router.use((req, res, next) => {
  try {
    if (!(req.originalUrl === "/user/login")){
      req.session = jwt.verify(req.headers.authorization.split(" ")[1], process.env.jwtSignatureKey)
    }
    next();
  } catch (_err) {
    res.status(401).send("Invalid JWT");
  }
})

router.post('/user/register', (req, res) => {
  register_user(req, res); 
});

router.post('/user/login', (req, res) => {
  login_user(req, res);
});

router.post('/user/delete', (req, res) => {
  delete_user(req, res);
})

router.post('/user/changePassword', (req, res) => {
  change_user_password(req, res);
})
