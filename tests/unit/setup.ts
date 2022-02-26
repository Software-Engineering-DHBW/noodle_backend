import { createConnection, getManager, EntityManager } from 'typeorm';
import * as argon2 from 'argon2';
import { ormOptions } from './helper';
import User from '../../src/entity/User';
import UserDetail from '../../src/entity/UserDetail';
import Grades from '../../src/entity/Grades';
import Module from '../../src/entity/Module';
import Course from '../../src/entity/Course';
import Timetable from '../../src/entity/Timetable';

const createUser = async (id, username, isAdministrator, isTeacher, manager): Promise<User> => {
  const user: User = new User();
  user.id = id;
  user.username = username;
  user.password = await argon2.hash(username);
  user.isAdministrator = isAdministrator;
  user.isTeacher = isTeacher;
  await manager.save(user);
  return user;
};

const createUserDetail = async (user, manager): Promise<UserDetail> => {
  const userDetails: UserDetail = new UserDetail();
  userDetails.userId = user;
  userDetails.fullname = user.username;
  userDetails.address = user.username;
  userDetails.matriculationNumber = user.username;
  userDetails.mail = user.username;
  await manager.save(userDetails);
  return userDetails;
};

const createGrade = async (id, userId, moduleId, gradeDef, manager): Promise<Grades> => {
  const grade: Grades = new Grades();
  grade.id = id;
  grade.moduleId = moduleId;
  grade.studentId = userId;
  grade.grade = gradeDef;
  grade.weight = 100;
  await manager.save(grade);
  return grade;
};

const createModule = async (id, moduleName, assignedTeacher, assignedCourse, manager): Promise<Module> => {
  const newModule: Module = new Module();
  newModule.id = id;
  newModule.name = moduleName;
  newModule.description = moduleName;
  newModule.assignedTeacher = assignedTeacher;
  newModule.assignedCourse = assignedCourse;
  await manager.save(newModule);
  return newModule;
};

const createCourse = async (id, name, students, manager): Promise<Course> => {
  const course: Course = new Course();
  course.id = id;
  course.name = name;
  course.students = students;
  await manager.save(course);
  return course;
};

const createTimetable = async (id, module, room, manager): Promise<Timetable> => {
  const startTime = new Date();
  const endTime = new Date(startTime);
  endTime.setHours(endTime.getHours() + 1);
  const timetable: Timetable = new Timetable();
  timetable.id = id;
  timetable.startTime = startTime;
  timetable.endTime = endTime;
  timetable.assignedModule = module;
  timetable.description = module.name;
  timetable.room = room;
  await manager.save(timetable);
  return timetable;
};

/**
 *Shared, valid objects, which will be used for the initialization of the database and by the tests
 */
const init = async () => {
  await createConnection(ormOptions).then(async (connection) => {
    const manager: EntityManager = getManager();
    const administrator: User = await createUser(1, 'administrator', true, false, manager);
    await createUserDetail(administrator, manager);
    const teacher = await createUser(2, 'teacher', false, true, manager);
    await createUserDetail(teacher, manager);
    const secondTeacher = await createUser(3, 'secondTeacher', false, true, manager);
    await createUserDetail(secondTeacher, manager);
    const student = await createUser(4, 'student', false, false, manager);
    await createUserDetail(student, manager);
    const secondStudent = await createUser(5, 'secondStudent', false, false, manager);
    await createUserDetail(secondStudent, manager);
    const course: Course = await createCourse(1, 'course', [student], manager);
    const secondCourse: Course = await createCourse(2, 'secondCourse', [secondStudent], manager);
    const module: Module = await createModule(1, 'module', [teacher], course, manager);
    const secondModule: Module = await createModule(2, 'secondModule', [secondTeacher], secondCourse, manager);
    await createGrade(1, student, module, 1, manager);
    await createGrade(2, secondStudent, secondModule, 2, manager);
    await createTimetable(1, module, '1', manager);
    await createTimetable(2, secondModule, '2', manager);
    await connection.close();
  });
};

init();
