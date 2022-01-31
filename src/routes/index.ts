import * as express from "express";
import { register_user, login_user } from "./User";
import { register_module } from "./Module";
import { register_course } from "./course";

export const router: express.Router = express.Router();

router.post('/user/register', (req, res) => {
  register_user(req, res);
});

router.post('/user/login', (req, res) => {
  login_user(req, res);
});

router.post('/module/register', (req, res) => {
  register_module(req, res);
})

router.post('/course/register', (req, res) => {
  register_course(req, res);
})
