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

  describe('Load tasklists', () => {
    test('GET /app/tasklist without cookies should return 401', done => {
      request(app)
        .get('/app/tasklist')
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /app/tasklist using invalid cookies should return 401', done => {
      request(app)
        .get('/app/tasklist')
        .set('Cookie', ['Sardonyx-Token=foobar'])
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /app/tasklist using valid user cookies should return a valid tasklist json', done => {
      request(app)
        .get('/app/tasklist')
        .set('Cookie', [userCookie])
        .then(response => {
          expect(response.statusCode).toBe(200);
          const tasklist = response.body;
          expect(typeof tasklist.id).toBe('number');
          expect(typeof tasklist.name).toBe('string');
          expect(typeof tasklist.description === 'string' || tasklist.description === null).toBeTruthy();
          done();
        });
    });

    test('GET /app/tasklist?tasklist=:tasklist using valid user cookies should return a valid tasklist json', done => {
      request(app)
        .get(`/app/tasklist?tasklist=${process.env.TASKLIST_ID}`)
        .set('Cookie', [userCookie])
        .then(response => {
          expect(response.statusCode).toBe(200);
          const tasklist = response.body;
          expect(tasklist.id).toBe(Number(process.env.TASKLIST_ID));
          done();
        });
    });

    test('GET /app/tasklist?tasklist=all using valid user cookies should return a valid tasklists json', done => {
      request(app)
        .get(`/app/tasklist?tasklist=all`)
        .set('Cookie', [userCookie])
        .then(response => {
          expect(response.statusCode).toBe(200);
          const tasklists = response.body;
          tasklists.forEach(item => {
            expect(typeof item.id).toBe('number');
            expect(typeof item.name).toBe('string');
            expect(typeof item.description === 'string' || item.description === null).toBeTruthy();
            done();
          });
        });
    });
  });
});