import * as express from "express";
import {register_user, login_user} from "./User";

export const router: express.Router = express.Router();

router.post('/user/register', (req, res) => {
  register_user(req, res); 
});

router.post('/user/login', (req, res) => {
  login_user(req, res)
});
