const request = require('supertest');
const app = require('../app');
const db = require('../db'); // Required, since db is usually started in server.js 

require('dotenv').config();

jest.setTimeout(60000);

describe('Load default', () => {
  describe('GET /api/validate', () => {
    test('GET /api/validate should return valid tokens', done => {
      request(app)
        .get('/api/validate')
        .set('Login-Token', `{"login":"${process.env.LOGIN}","password":"${process.env.PASSWORD}"}`)
        .then(response => {
          expect(response.statusCode).toBe(200);
          const credentials = JSON.parse(response.headers['login-token'] || '{}');
          expect(credentials).toHaveProperty('cfduid');
          expect(credentials).toHaveProperty('managebacSession');
          expect(credentials).toHaveProperty('authenticityToken');
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
            expect(typeof item.id).toBe('number');
            expect(isNaN(item.id)).toBeFalsy();
            expect(typeof item.title).toBe('string');
            expect(typeof item.link).toBe('string');
            expect(Array.isArray(item.labels)).toBeTruthy();
            expect(typeof item.deadline).toBe('boolean');
            expect(typeof item.due).toBe('string');
            expect(isNaN(Date.parse(item.due))).toBeFalsy();
            expect(typeof item.author).toBe('string');
            expect(typeof item.avatar === 'string' || item.avatar === null).toBeTruthy();
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
            expect(typeof item.id).toBe('number');
            expect(isNaN(item.id)).toBeFalsy();
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
            expect(typeof item.id).toBe('number');
            expect(isNaN(item.id)).toBeFalsy();
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

    test('GET /api/validate should return a valid user json', done => {
      request(app)
        .get('/api/validate')
        .set('Login-Token', `{"login":"${process.env.LOGIN}","password":"${process.env.PASSWORD}"}`)
        .then(response => {
          const user = JSON.parse(response.headers['managebac-data']).user;
          expect(typeof user.id).toBe('number');
          expect(isNaN(user.id)).toBeFalsy();
          expect(typeof user.name).toBe('string');
          expect(typeof user.avatar).toBe('string');
          done();
        });
    });
  });

  db.connect(err => {
    if (err) {
      console.error('There was an error connecting to MySQL. ' + err);
      process.exit(1);
    }

    describe('POST /api/login', () => {
      test('POST /api/login should return valid tokens', done => {
        request(app)
          .post('/api/login')
          .set('Content-Type', 'multipart/form-data')
          .field('login', process.env.LOGIN)
          .field('password', process.env.PASSWORD)
          .then(response => {
            expect(response.statusCode).toBe(200);
            const credentials = JSON.parse(response.headers['login-token'] || '{}');
            expect(credentials).toHaveProperty('cfduid');
            expect(credentials).toHaveProperty('managebacSession');
            expect(credentials).toHaveProperty('authenticityToken');
            expect(response.headers).toHaveProperty('sardonyx-token');
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
              expect(typeof item.id).toBe('number');
              expect(isNaN(item.id)).toBeFalsy();
              expect(typeof item.title).toBe('string');
              expect(typeof item.link).toBe('string');
              expect(Array.isArray(item.labels)).toBeTruthy();
              expect(typeof item.deadline).toBe('boolean');
              expect(typeof item.due).toBe('string');
              expect(isNaN(Date.parse(item.due))).toBeFalsy();
              expect(typeof item.author).toBe('string');
              expect(typeof item.avatar === 'string' || item.avatar === null).toBeTruthy();
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
              expect(typeof item.id).toBe('number');
              expect(isNaN(item.id)).toBeFalsy();
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
              expect(typeof item.id).toBe('number');
              expect(isNaN(item.id)).toBeFalsy();
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

      test('POST /api/login should return a valid user json', done => {
        request(app)
          .post('/api/login')
          .set('Content-Type', 'multipart/form-data')
          .field('login', process.env.LOGIN)
          .field('password', process.env.PASSWORD)
          .then(response => {
            const user = JSON.parse(response.headers['managebac-data']).user;
            expect(typeof user.id).toBe('number');
            expect(isNaN(user.id)).toBeFalsy();
            expect(typeof user.name).toBe('string');
            expect(typeof user.avatar).toBe('string');
            done();
          });
      });
    });
  });

  describe('GET /api/dashboard', () => {
    test('GET /api/dashboard should return valid tokens', done => {
      request(app)
        .get('/api/dashboard')
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(200);
          const credentials = JSON.parse(response.headers['login-token'] || '{}');
          expect(credentials).toHaveProperty('cfduid');
          expect(credentials).toHaveProperty('managebacSession');
          expect(credentials).toHaveProperty('authenticityToken');
          done();
        });
    });

    test('GET /api/dashboard should return a valid deadlines json', done => {
      request(app)
        .get('/api/dashboard')
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          const deadlines = JSON.parse(response.headers['managebac-data']).deadlines;
          deadlines.forEach(item => {
            expect(typeof item.id).toBe('number');
            expect(isNaN(item.id)).toBeFalsy();
            expect(typeof item.title).toBe('string');
            expect(typeof item.link).toBe('string');
            expect(Array.isArray(item.labels)).toBeTruthy();
            expect(typeof item.deadline).toBe('boolean');
            expect(typeof item.due).toBe('string');
            expect(isNaN(Date.parse(item.due))).toBeFalsy();
            expect(typeof item.author).toBe('string');
            expect(typeof item.avatar === 'string' || item.avatar === null).toBeTruthy();
          });
          done();
        });
    });

    test('GET /api/dashboard should return a valid classes json', done => {
      request(app)
        .get('/api/dashboard')
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          const classes = JSON.parse(response.headers['managebac-data']).classes;
          classes.forEach(item => {
            expect(typeof item.id).toBe('number');
            expect(isNaN(item.id)).toBeFalsy();
            expect(typeof item.title).toBe('string');
            expect(typeof item.link).toBe('string');
          });
          done();
        });
    });

    test('GET /api/dashboard should return a valid groups json', done => {
      request(app)
        .get('/api/dashboard')
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          const groups = JSON.parse(response.headers['managebac-data']).groups;
          groups.forEach(item => {
            expect(typeof item.id).toBe('number');
            expect(isNaN(item.id)).toBeFalsy();
            expect(typeof item.title).toBe('string');
            expect(typeof item.link).toBe('string');
          });
          done();
        });
    });

    test('GET /api/dashboard should return a valid notification count', done => {
      request(app)
        .get('/api/dashboard')
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          const notificationCount = JSON.parse(response.headers['managebac-data']).notificationCount;
          expect(typeof notificationCount).toBe('number');
          done();
        });
    });

    test('GET /api/dashboard should return a valid user json', done => {
      request(app)
        .get('/api/dashboard')
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          const user = JSON.parse(response.headers['managebac-data']).user;
          expect(typeof user.id).toBe('number');
          expect(isNaN(user.id)).toBeFalsy();
          expect(typeof user.name).toBe('string');
          expect(typeof user.avatar).toBe('string');
          done();
        });
    });
  });
});