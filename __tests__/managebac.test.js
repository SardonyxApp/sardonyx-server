const request = require('supertest');
const app = require('../app');

require('dotenv').config();

jest.setTimeout(30000);

describe('Load default', () => {
  describe('GET /api/validate', () => {
    test('GET /api/validate should return a response json', done => {
      request(app)
        .get('/api/validate')
        .set('Login-Token', `{"login":"${process.env.LOGIN}","password":"${process.env.PASSWORD}"}`)
        .then(response => {
          expect(response.headers['managebac-data']).toBeTruthy();
          done();
        });
    });

    test('GET /api/validate should return a valid deadlines json', done => {
      request(app)
        .get('/api/validate')
        .set('Login-Token', `{"login":"${process.env.LOGIN}","password":"${process.env.PASSWORD}"}`)
        .then(response => {
          const deadlines = JSON.parse(response.headers['managebac-data']).deadlines;
          deadlines.forEach(item => {
            expect(typeof item.title).toBe('string');
            expect(typeof item.link).toBe('string');
            expect(Array.isArray(item.labels)).toBeTruthy();
            expect(typeof item.deadline).toBe('boolean');
            expect(typeof item.due).toBe('string');
            expect(typeof Date.parse(item.due)).toBe('number');
            expect(typeof item.author).toBe('string');
            expect(typeof item.avatar === 'string' || item.avatar === false).toBeTruthy();
          });
          done();
        });
    });

    test('GET /api/validate should return a valid classes json', done => {
      request(app)
        .get('/api/validate')
        .set('Login-Token', `{"login":"${process.env.LOGIN}","password":"${process.env.PASSWORD}"}`)
        .then(response => {
          const classes = JSON.parse(response.headers['managebac-data']).classes;
          classes.forEach(item => {
            expect(typeof item.title).toBe('string');
            expect(typeof item.link).toBe('string');
          });
          done();
        });
    });

    test('GET /api/validate should return a valid groups json', done => {
      request(app)
        .get('/api/validate')
        .set('Login-Token', `{"login":"${process.env.LOGIN}","password":"${process.env.PASSWORD}"}`)
        .then(response => {
          const groups = JSON.parse(response.headers['managebac-data']).groups;
          groups.forEach(item => {
            expect(typeof item.title).toBe('string');
            expect(typeof item.link).toBe('string');
          });
          done();
        });
    });

    test('GET /api/validate should return a valid notification count', done => {
      request(app)
        .get('/api/validate')
        .set('Login-Token', `{"login":"${process.env.LOGIN}","password":"${process.env.PASSWORD}"}`)
        .then(response => {
          const notificationCount = JSON.parse(response.headers['managebac-data']).notificationCount;
          expect(typeof notificationCount).toBe('number');
          done();
        });
    });
  });

  describe('POST /api/login', () => {
    test('POST /api/login should return a response json', done => {
      request(app)
        .post('/api/login')
        .set('Content-Type', 'multipart/form-data')
        .field('login', process.env.LOGIN)
        .field('password', process.env.PASSWORD)
        .then(response => {
          expect(response.headers['managebac-data']).toBeTruthy();
          done();
        });
    });

    test('POST /api/login should return a valid deadlines json', done => {
      request(app)
        .post('/api/login')
        .set('Content-Type', 'multipart/form-data')
        .field('login', process.env.LOGIN)
        .field('password', process.env.PASSWORD)
        .then(response => {
          const deadlines = JSON.parse(response.headers['managebac-data']).deadlines;
          deadlines.forEach(item => {
            expect(typeof item.title).toBe('string');
            expect(typeof item.link).toBe('string');
            expect(Array.isArray(item.labels)).toBeTruthy();
            expect(typeof item.deadline).toBe('boolean');
            expect(typeof item.due).toBe('string');
            expect(typeof Date.parse(item.due)).toBe('number');
            expect(typeof item.author).toBe('string');
            expect(typeof item.avatar === 'string' || item.avatar === false).toBeTruthy();
          });
          done();
        });
    });

    test('POST /api/login should return a valid classes json', done => {
      request(app)
        .post('/api/login')
        .set('Content-Type', 'multipart/form-data')
        .field('login', process.env.LOGIN)
        .field('password', process.env.PASSWORD)
        .then(response => {
          const classes = JSON.parse(response.headers['managebac-data']).classes;
          classes.forEach(item => {
            expect(typeof item.title).toBe('string');
            expect(typeof item.link).toBe('string');
          });
          done();
        });
    });

    test('POST /api/login should return a valid groups json', done => {
      request(app)
        .post('/api/login')
        .set('Content-Type', 'multipart/form-data')
        .field('login', process.env.LOGIN)
        .field('password', process.env.PASSWORD)
        .then(response => {
          const groups = JSON.parse(response.headers['managebac-data']).groups;
          groups.forEach(item => {
            expect(typeof item.title).toBe('string');
            expect(typeof item.link).toBe('string');
          });
          done();
        });
    });

    test('POST /api/login should return a valid notification count', done => {
      request(app)
        .post('/api/login')
        .set('Content-Type', 'multipart/form-data')
        .field('login', process.env.LOGIN)
        .field('password', process.env.PASSWORD)
        .then(response => {
          const notificationCount = JSON.parse(response.headers['managebac-data']).notificationCount;
          expect(typeof notificationCount).toBe('number');
          done();
        });
    });
  });
});