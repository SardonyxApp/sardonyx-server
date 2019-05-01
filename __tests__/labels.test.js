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

  describe('Load subjects', () => {
    test('GET /app/subjects without cookies should return 401', done => {
      request(app)
        .get('/app/subjects')
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /app/subjects using invalid cookies should return 401', done => {
      request(app)
        .get('/app/subjects')
        .set('Cookie', ['Sardonyx-Token=foobar'])
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /app/subjects using valid student cookies should return a valid subjects json', done => {
      request(app)
        .get('/app/subjects')
        .set('Cookie', [studentCookie])
        .then(response => {
          expect(response.statusCode).toBe(200);
          const subjects = response.body;
          subjects.forEach(item => {
            expect(typeof item.id).toBe('number');
            expect(typeof item.name).toBe('string');
            expect(typeof item.color).toBe('string');
            expect(typeof item.tasklist_id).toBe('number');
          });
          done();
        });
    });

    test('GET /app/subjects using valid teacher cookies should return a valid subjects json', done => {
      request(app)
        .get('/app/subjects')
        .set('Cookie', [teacherCookie])
        .then(response => {
          expect(response.statusCode).toBe(200);
          const subjects = response.body;
          subjects.forEach(item => {
            expect(typeof item.id).toBe('number');
            expect(typeof item.name).toBe('string');
            expect(typeof item.color).toBe('string');
            expect(typeof item.tasklist_id).toBe('number');
          });
          done();
        });
    });

    test('GET /app/subjects?tasklist=:tasklist using valid student cookies should return 403 when student is not allowed access', done => {
      request(app)
        .get(`/app/subjects?tasklist=${process.env.TASKLIST_ID}`)
        .set('Cookie', [studentCookie])
        .then(response => {
          expect(response.statusCode).toBe(403);
          done();
        });
    });

    test('GET /app/subjects?tasklist=:tasklist using valid teacher cookies should return a valid tasklist json', done => {
      request(app)
        .get(`/app/subjects?tasklist=${process.env.TASKLIST_ID}`)
        .set('Cookie', [teacherCookie])
        .then(response => {
          expect(response.statusCode).toBe(200);
          const subjects = response.body;
          subjects.forEach(item => {
            expect(item.tasklist_id).toBe(Number(process.env.TASKLIST_ID));
          });
          done();
        });
    });
  });

  describe('Load categories', () => {
    test('GET /app/categories without cookies should return 401', done => {
      request(app)
        .get('/app/categories')
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /app/categories using invalid cookies should return 401', done => {
      request(app)
        .get('/app/categories')
        .set('Cookie', ['Sardonyx-Token=foobar'])
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /app/categories using valid student cookies should return a valid categories json', done => {
      request(app)
        .get('/app/categories')
        .set('Cookie', [studentCookie])
        .then(response => {
          expect(response.statusCode).toBe(200);
          const categories = response.body;
          categories.forEach(item => {
            expect(typeof item.id).toBe('number');
            expect(typeof item.name).toBe('string');
            expect(typeof item.color).toBe('string');
            expect(typeof item.tasklist_id).toBe('number');
          });
          done();
        });
    });

    test('GET /app/categories using valid teacher cookies should return a valid subjects json', done => {
      request(app)
        .get('/app/categories')
        .set('Cookie', [teacherCookie])
        .then(response => {
          expect(response.statusCode).toBe(200);
          const categories = response.body;
          categories.forEach(item => {
            expect(typeof item.id).toBe('number');
            expect(typeof item.name).toBe('string');
            expect(typeof item.color).toBe('string');
            expect(typeof item.tasklist_id).toBe('number');
          });
          done();
        });
    });

    test('GET /app/categories?tasklist=:tasklist using valid student cookies should return 403 when student is not allowed access', done => {
      request(app)
        .get(`/app/categories?tasklist=${process.env.TASKLIST_ID}`)
        .set('Cookie', [studentCookie])
        .then(response => {
          expect(response.statusCode).toBe(403);
          done();
        });
    });

    test('GET /app/categories?tasklist=:tasklist using valid teacher cookies should return a valid tasklist json', done => {
      request(app)
        .get(`/app/categories?tasklist=${process.env.TASKLIST_ID}`)
        .set('Cookie', [teacherCookie])
        .then(response => {
          expect(response.statusCode).toBe(200);
          const categories = response.body;
          categories.forEach(item => {
            expect(item.tasklist_id).toBe(Number(process.env.TASKLIST_ID));
          });
          done();
        });
    });
  });
});