import { createConnection, getManager, EntityManager } from 'typeorm';
import * as argon2 from 'argon2';
import User from '../../src/entity/User';
import UserDetail from '../../src/entity/UserDetail';
import connectionOptions from '../../src/index';

module.exports = async () => {
  await createConnection(connectionOptions).then(async (connection) => {
    // Create a teacher for e2e-testing
    const manager: EntityManager = getManager();
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
    const user = new User();
    user.id = 3;
    user.username = 'student';
    user.password = await argon2.hash('student');
    const userDetails = new UserDetail();
    userDetails.userId = user;
    userDetails.fullname = 'student';
    userDetails.address = 'student';
    userDetails.matriculationNumber = 'student';
    userDetails.mail = 'student@noodle.pasta';
    await manager.save(manager.create(User, user));
    await manager.save(manager.create(UserDetail, userDetails));
    connection.close();
  });
};
