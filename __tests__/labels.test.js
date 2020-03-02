const request = require('supertest');
const app = require('../app');
const db = require('../db');

const jwt = require('jsonwebtoken');

require('dotenv').config();

jest.setTimeout(60000);

const userCookie = `Sardonyx-Token=${jwt.sign({
  id: process.env.USER_ID,
  email: process.env.USER_EMAIL,
  tasklist: process.env.USER_DEFAULT_TASKLIST
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

    test('GET /app/subjects using valid user cookies should return a valid subjects json', done => {
      request(app)
        .get('/app/subjects')
        .set('Cookie', [userCookie])
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

    test('GET /app/subjects?tasklist=:tasklist using valid user cookies should return a valid tasklist json', done => {
      request(app)
        .get(`/app/subjects?tasklist=${process.env.TASKLIST_ID}`)
        .set('Cookie', [userCookie])
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

    test('GET /app/categories using valid user cookies should return a valid subjects json', done => {
      request(app)
        .get('/app/categories')
        .set('Cookie', [userCookie])
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

    test('GET /app/categories?tasklist=:tasklist using valid user cookies should return a valid tasklist json', done => {
      request(app)
        .get(`/app/categories?tasklist=${process.env.TASKLIST_ID}`)
        .set('Cookie', [userCookie])
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