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

  describe('Load user', () => {
    describe('Load user', () => {
      test('GET /app/user without cookies should return 401', done => {
        request(app)
          .get('/app/user')
          .then(response => {
            expect(response.statusCode).toBe(401);
            done();
          });
      });
  
      test('GET /app/user using invalid cookies should return 401', done => {
        request(app)
          .get('/app/user')
          .set('Cookie', ['Sardonyx-Token=foobar'])
          .then(response => {
            expect(response.statusCode).toBe(401);
            done();
          });
      });
  
      test('GET /app/user using valid student cookies should return a valid user json', done => {
        request(app)
          .get('/app/user')
          .set('Cookie', [studentCookie])
          .then(response => {
            expect(response.statusCode).toBe(200);
            const user = response.body;
            expect(typeof user.id).toBe('number');
            expect(typeof user.name).toBe('string');
            expect(typeof user.email).toBe('string');
            expect(typeof user.tasklist_id).toBe('number');
            expect(user.teacher).toBeFalsy();
            expect(Array.isArray(user.subjects)).toBeTruthy();
            user.subjects.forEach(item => {
              expect(typeof item).toBe('number');
            });
            expect(Array.isArray(user.categories)).toBeTruthy();
            user.categories.forEach(item => {
              expect(typeof item).toBe('number');
            });
            done();
          });
      });
  
      test('GET /app/user using valid teacher cookies should return a valid user json', done => {
        request(app)
          .get('/app/user')
          .set('Cookie', [teacherCookie])
          .then(response => {
            expect(response.statusCode).toBe(200);
            const user = response.body;
            expect(typeof user.id).toBe('number');
            expect(typeof user.name).toBe('string');
            expect(typeof user.email).toBe('string');
            expect(typeof user.tasklist_id).toBe('number');
            expect(user.teacher).toBeTruthy();
            expect(Array.isArray(user.subjects)).toBeTruthy();
            user.subjects.forEach(item => {
              expect(typeof item).toBe('number');
            });
            expect(Array.isArray(user.categories)).toBeTruthy();
            user.categories.forEach(item => {
              expect(typeof item).toBe('number');
            });
            done();
          });
      });
  
      test('GET /app/user?tasklist=:tasklist using valid student cookies should return 403 when student is not allowed access', done => {
        request(app)
          .get(`/app/user?tasklist=${process.env.TASKLIST_ID}`)
          .set('Cookie', [studentCookie])
          .then(response => {
            expect(response.statusCode).toBe(403);
            done();
          });
      });
  
      test('GET /app/user?tasklist=:tasklist using valid teacher cookies should return a valid tasklist json', done => {
        request(app)
          .get(`/app/user?tasklist=${process.env.TASKLIST_ID}`)
          .set('Cookie', [teacherCookie])
          .then(response => {
            expect(response.statusCode).toBe(200);
            const user = response.body;
            expect(Array.isArray(user.subjects)).toBeTruthy();
            expect(Array.isArray(user.categories)).toBeTruthy();
            // Cannot really test whether each label belongs to correct tasklist 
            done();
          });
      });
    });
  });
});