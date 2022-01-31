import * as express from "express";
import { register_user, login_user } from "./User";
import { registerModule } from "./Module";
import { addStudent, registerCourse } from "./course";

export const router: express.Router = express.Router();

router.post('/user/register', (req, res) => {
  register_user(req, res);
});

router.post('/user/login', (req, res) => {
  login_user(req, res);
});

router.post('/module/register', (req, res) => {
  registerModule(req, res);
})

router.post('/course/register', (req, res) => {
  registerCourse(req, res);
})

router.post('/course/addStudent', (req, res) => {
  addStudent(req, res);
})
