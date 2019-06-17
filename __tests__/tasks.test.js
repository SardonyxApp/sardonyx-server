const request = require('supertest');
const app = require('../app');
const db = require('../db');

const jwt = require('jsonwebtoken');

require('dotenv').config();

jest.setTimeout(60000);

const studentCookie = `Sardonyx-Token=${jwt.sign({
  teacher: false,
  id: process.env.STUDENT_ID,
  email: process.env.STUDENT_EMAIL,
  tasklist: process.env.STUDENT_TASKLIST
}, process.env.PRIVATE_KEY, {
  expiresIn: '1d'
})}`;

const teacherCookie = `Sardonyx-Token=${jwt.sign({
  teacher: true,
  id: process.env.TEACHER_ID,
  email: process.env.TEACHER_EMAIL,
  tasklist: process.env.TEACHER_DEFAULT_TASKLIST
}, process.env.PRIVATE_KEY, {
  expiresIn: '1d'
})}`;

db.connect(err => {
  if (err) {
    console.error('There was an error connecting to MySQL. ' + err);
    process.exit(1);
  }

  describe('Load tasks', () => {
    test('GET /app/tasks without cookies should return 401', done => {
      request(app)
        .get('/app/tasks')
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /app/tasks using invalid cookies should return 401', done => {
      request(app)
        .get('/app/tasks')
        .set('Cookie', ['Sardonyx-Token=foobar'])
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /app/tasks using valid student cookies should return a valid tasks json', done => {
      request(app)
        .get('/app/tasks')
        .set('Cookie', [studentCookie])
        .then(response => {
          expect(response.statusCode).toBe(200);
          const tasks = response.body;
          tasks.forEach(item => {
            expect(typeof item.id).toBe('number');
            expect(typeof item.name).toBe('string');
            expect(typeof item.description === 'string' || item.description === null).toBeTruthy();
            expect(!isNaN(Date.parse(item.due)) || item.due === null).toBeTruthy();
            expect(typeof item.tasklist_id).toBe('number');
            expect(typeof item.student_id === 'number' || item.student_id === null).toBeTruthy();
            expect(typeof item.teacher_id === 'number' || item.teacher_id === null).toBeTruthy();
            expect(typeof item.managebac === 'string' || item.managebac === null).toBeTruthy();
          });
          done();
        });
    });

    test('GET /app/tasks using valid teacher cookies should return a valid tasks json', done => {
      request(app)
        .get('/app/tasks')
        .set('Cookie', [teacherCookie])
        .then(response => {
          expect(response.statusCode).toBe(200);
          const tasks = response.body;
          tasks.forEach(item => {
            expect(typeof item.id).toBe('number');
            expect(typeof item.name).toBe('string');
            expect(typeof item.description === 'string' || item.description === null).toBeTruthy();
            expect(!isNaN(Date.parse(item.due)) || item.due === null).toBeTruthy();
            expect(typeof item.tasklist_id).toBe('number');
            expect(typeof item.student_id === 'number' || item.student_id === null).toBeTruthy();
            expect(typeof item.teacher_id === 'number' || item.teacher_id === null).toBeTruthy();
            expect(typeof item.managebac === 'string' || item.managebac === null).toBeTruthy();
          });
          done();
        });
    });

    test('GET /app/tasks?full=true using valid student cookies should return a valid tasks json', done => {
      request(app)
        .get('/app/tasks?full=true')
        .set('Cookie', [studentCookie])
        .then(response => {
          expect(response.statusCode).toBe(200);
          const tasks = response.body;
          tasks.forEach(item => {
            expect(typeof item.id).toBe('number');
            expect(typeof item.name).toBe('string');
            expect(typeof item.description === 'string' || item.description === null).toBeTruthy();
            expect(!isNaN(Date.parse(item.due)) || item.due === null).toBeTruthy();
            expect(typeof item.tasklist_id).toBe('number');
            expect(typeof item.student_id === 'number' || item.student_id === null).toBeTruthy();
            expect(typeof item.student_name === 'string' || item.student_name === null).toBeTruthy();
            expect(typeof item.teacher_id === 'number' || item.teacher_id === null).toBeTruthy();
            expect(typeof item.teacher_name === 'string' || item.teacher_name === null).toBeTruthy();
            expect(typeof item.subject_id === 'number' || item.subject_id === null).toBeTruthy();
            expect(typeof item.subject_name === 'string' || item.subject_name === null).toBeTruthy();
            expect(typeof item.subject_color === 'string' || item.subject_color === null).toBeTruthy();
            expect(typeof item.category_id === 'number' || item.category_id === null).toBeTruthy();
            expect(typeof item.category_name === 'string' || item.category_name === null).toBeTruthy();
            expect(typeof item.category_color === 'string' || item.category_color === null).toBeTruthy();
            expect(typeof item.managebac === 'string' || item.managebac === null).toBeTruthy();
          });
          done();
        });
    });

    test('GET /app/tasks?full=true using valid teacher cookies should return a valid tasks json', done => {
      request(app)
        .get('/app/tasks?full=true')
        .set('Cookie', [teacherCookie])
        .then(response => {
          expect(response.statusCode).toBe(200);
          const tasks = response.body;
          tasks.forEach(item => {
            expect(typeof item.id).toBe('number');
            expect(typeof item.name).toBe('string');
            expect(typeof item.description === 'string' || item.description === null).toBeTruthy();
            expect(!isNaN(Date.parse(item.due)) || item.due === null).toBeTruthy();
            expect(typeof item.tasklist_id).toBe('number');
            expect(typeof item.student_id === 'number' || item.student_id === null).toBeTruthy();
            expect(typeof item.student_name === 'string' || item.student_name === null).toBeTruthy();
            expect(typeof item.teacher_id === 'number' || item.teacher_id === null).toBeTruthy();
            expect(typeof item.teacher_name === 'string' || item.teacher_name === null).toBeTruthy();
            expect(typeof item.subject_id === 'number' || item.subject_id === null).toBeTruthy();
            expect(typeof item.subject_name === 'string' || item.subject_name === null).toBeTruthy();
            expect(typeof item.subject_color === 'string' || item.subject_color === null).toBeTruthy();
            expect(typeof item.category_id === 'number' || item.category_id === null).toBeTruthy();
            expect(typeof item.category_name === 'string' || item.category_name === null).toBeTruthy();
            expect(typeof item.category_color === 'string' || item.category_color === null).toBeTruthy();
            expect(typeof item.managebac === 'string' || item.managebac === null).toBeTruthy();
          });
          done();
        });
    });

    test('GET /app/tasks?tasklist=:tasklist using valid student cookies should return 403 when student is not allowed access', done => {
      request(app)
        .get(`/app/tasks?tasklist=${process.env.TASKLIST_ID}`)
        .set('Cookie', [studentCookie])
        .then(response => {
          expect(response.statusCode).toBe(403);
          done();
        });
    });

    test('GET /app/tasks?tasklist=:tasklist using valid teacher cookies should return a valid tasks json', done => {
      request(app)
        .get(`/app/tasks?tasklist=${process.env.TASKLIST_ID}`)
        .set('Cookie', [teacherCookie])
        .then(response => {
          expect(response.statusCode).toBe(200);
          const tasks = response.body;
          tasks.forEach(item => {
            // test omitted for a myriad of other properties tested above 
            expect(item.tasklist_id).toBe(Number(process.env.TASKLIST_ID));
          });
          done();
        });
    });

    test('GET /appp/tasks?tasklist=:tasklist using valid teacher cookies and invalid tasklist id should return empty array', done => {
      request(app)
        .get(`/app/tasks?tasklist=foobar`)
        .set('Cookie', [teacherCookie])
        .then(response => {
          expect(response.statusCode).toBe(200);
          expect(response.body.length).toBe(0);
          done();
        });
    });
  });

  // describe('Change tasks', () => {
  //   test('POST /app/tasks without cookies should return 401', done => {
  //     request(app)
  //       .post('/app/tasks')
  //       .send({
  //         name: process.env.TASK_NAME,
  //         description: null,
  //         due: null,
  //         tasklist_id: process.env.TASKLIST_ID,
  //         student_id: process.env.STUDENT_ID,
  //         teacher_id: null,
  //         subject_id: null,
  //         category_id: null
  //       })
  //       .then(response => {
  //         expect(response.statusCode).toBe(401);
  //         done();
  //       });
  //   });

  //   test('POST /app/tasks using invalid cookies should return 401', done => {
  //     request(app)
  //       .post('/app/tasks')
  //       .set('Cookie', ['Sardonyx-Token=foobar'])
  //       .send({
  //         name: process.env.TASK_NAME,
  //         description: null,
  //         due: null,
  //         tasklist_id: process.env.TASKLIST_ID,
  //         student_id: process.env.STUDENT_ID,
  //         teacher_id: null,
  //         subject_id: null,
  //         category_id: null
  //       })
  //       .then(response => {
  //         expect(response.statusCode).toBe(401);
  //         done();
  //       });
  //   });

  //   // ID doesn't matter in these cases 
  //   test('PATCH /app/tasks without cookies should return 401', done => {
  //     request(app)
  //       .patch('/app/tasks')
  //       .send({
  //         description: process.env.TASK_DESCRIPTION
  //       })
  //       .then(response => {
  //         expect(response.statusCode).toBe(401);
  //         done();
  //       });
  //   });

  //   test('PATCH /app/tasks using invalid cookies should return 401', done => {
  //     request(app)
  //       .patch('/app/tasks')
  //       .set('Cookie', ['Sardonyx-Token=foobar'])
  //       .send({
  //         description: process.env.TASK_DESCRIPTION
  //       })
  //       .then(response => {
  //         expect(response.statusCode).toBe(401);
  //         done();
  //       });
  //   });

  //   test('DELETE /app/tasks without cookies should return 401', done => {
  //     request(app)
  //       .delete('/app/tasks')
  //       .then(response => {
  //         expect(response.statusCode).toBe(401);
  //         done();
  //       });
  //   });

  //   test('DELETE /app/tasks using invalid cookies should return 401', done => {
  //     request(app)
  //       .delete('/app/tasks')
  //       .set('Cookie', ['Sardonyx-Token=foobar'])
  //       .then(response => {
  //         expect(response.statusCode).toBe(401);
  //         done();
  //       });
  //   });

  //   test('POST /app/tasks using valid student cookies should return a valid insertId', done => {
  //     request(app)
  //       .post('/app/tasks')
  //       .set('Cookie', [process.env.studentCookie])
  //       .send({
  //         name: process.env.TASK_ID,
  //         description: null,
  //         due: null,
  //         tasklist_id: process.env.TASKLIST_ID,
  //         student_id: process.env.STUDENT_ID,
  //         teacher_id: null,
  //         subject_id: null,
  //         category_id: null
  //       })
  //       .then(response => {
  //         expect(response.statusCode).toBe(200);
  //         expect(typeof response.body.insertId).toBe('number');
  //         done();
  //       });
  //   });

  //   test('POST /app/tasks using valid teacher cookies should return a valid insertId', done => {
  //     request(app)
  //       .post('/app/tasks')
  //       .set('Cookie', [process.env.teacherCookie])
  //       .send({
  //         name: process.env.TASK_ID,
  //         description: null,
  //         due: null,
  //         tasklist_id: process.env.TASKLIST_ID,
  //         student_id: null,
  //         teacher_id: process.env.TEACHER_ID,
  //         subject_id: null,
  //         category_id: null
  //       })
  //       .then(response => {
  //         expect(response.statusCode).toBe(200);
  //         expect(typeof response.body.insertId).toBe('number');
  //         done();
  //       });
  //   });
  // });
});