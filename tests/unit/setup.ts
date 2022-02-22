import { createConnection, getManager, EntityManager } from 'typeorm';
import * as argon2 from 'argon2';
import { ormOptions } from './helper';
import User from '../../src/entity/User';
import UserDetail from '../../src/entity/UserDetail';

const init = async () => {
  await createConnection(ormOptions).then(async (connection) => {
    const manager: EntityManager = getManager();
    const user = new User();
    user.id = 1;
    user.username = 'administrator';
    user.password = await argon2.hash('administrator');
    user.isAdministrator = true;
    const userDetails = new UserDetail();
    userDetails.userId = user;
    userDetails.fullname = 'Administrator';
    userDetails.address = 'Administrator Street';
    userDetails.matriculationNumber = '123456789';
    userDetails.mail = 'admin@noodle.pasta';
    await manager.save(manager.create(User, user));
    await manager.save(manager.create(UserDetail, userDetails));
    // Create a teacher for e2e-testing
    const teacher = new User();
    teacher.id = 2;
    teacher.username = 'teacher';
    teacher.password = await argon2.hash('teacher');
    teacher.isTeacher = true;
    const teacherDetail = new UserDetail();
    teacherDetail.userId = teacher;
    teacherDetail.fullname = 'teacher';
    teacherDetail.address = 'teacher';
    teacherDetail.matriculationNumber = 'teacher';
    teacherDetail.mail = 'teacher@noodle.pasta';
    await manager.save(manager.create(User, teacher));
    await manager.save(manager.create(UserDetail, teacherDetail));
    // Create a student for e2e-testing
    const student = new User();
    student.id = 3;
    student.username = 'student';
    student.password = await argon2.hash('student');
    const studentDetails = new UserDetail();
    studentDetails.userId = student;
    studentDetails.fullname = 'student';
    studentDetails.address = 'student';
    studentDetails.matriculationNumber = 'student';
    studentDetails.mail = 'student@noodle.pasta';
    await manager.save(manager.create(User, student));
    await manager.save(manager.create(UserDetail, studentDetails));
    connection.close();
  });
};

init();
