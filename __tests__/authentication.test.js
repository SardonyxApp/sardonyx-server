const request = require('supertest');
const app = require('../app');
const db = require('../db');

require('dotenv').config();

jest.setTimeout(30000);

describe('Authentication API', () => {
  describe('GET /api/validate', () => {
    test('GET /api/validate should return 401 without credentials', (done) => {
      request(app)
        .get('/api/validate')
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /api/validate should return 200 with valid credentials', (done) => {
      request(app)
        .get('/api/validate')
        .set('Login-Token', `{"login":"${process.env.LOGIN}","password":"${process.env.PASSWORD}"}`)
        .then(response => {
          expect(response.statusCode).toBe(200);
          done();
        });
    });

    test('GET /api/validate should return 401 with invalid login', (done) => {
      request(app)
        .get('/api/validate')
        .set('Login-Token', `{"login":"foo@bar.com","password":"${process.env.PASSWORD}"}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /api/validate should return 401 with invalid password', (done) => {
      request(app)
        .get('/api/validate')
        .set('Login-Token', `{"login":"${process.env.LOGIN}","password":"foobar"}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /api/validate should return Login-Token with valid credentials', (done) => {
      request(app)
        .get('/api/validate')
        .set('Login-Token', `{"login":"${process.env.LOGIN}","password":"${process.env.PASSWORD}"}`)
        .then(response => {
          const credentials = JSON.parse(response.headers['login-token'] || '{}');
          expect(credentials).toHaveProperty('login');
          expect(credentials).toHaveProperty('password');
          expect(credentials).toHaveProperty('managebacSession');
          expect(credentials).toHaveProperty('cfduid');
          expect(credentials).toHaveProperty('authenticityToken');
          done();
        });
    });
  });

  describe('GET /api/login', () => {
    test('GET /api/login should return 401 without credentials', (done) => {
      request(app)
        .get('/api/login')
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /api/login should return 200 with valid credentials', (done) => {
      request(app)
        .get('/api/login')
        .set('Login-Token', `{"login":"${process.env.LOGIN}","password":"${process.env.PASSWORD}"}`)
        .then(response => {
          expect(response.statusCode).toBe(200);
          done();
        });
    });

    test('GET /api/login should return 401 with invalid login', (done) => {
      request(app)
        .get('/api/login')
        .set('Login-Token', `{"login":"foo@bar.com","password":"${process.env.PASSWORD}"}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /api/login should return 401 with invalid password', (done) => {
      request(app)
        .get('/api/login')
        .set('Login-Token', `{"login":"${process.env.LOGIN}","password":"foobar"}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /api/login should return Login-Token with valid credentials', (done) => {
      request(app)
        .get('/api/login')
        .set('Login-Token', `{"login":"${process.env.LOGIN}","password":"${process.env.PASSWORD}"}`)
        .then(response => {
          const credentials = JSON.parse(response.headers['login-token'] || '{}');
          expect(credentials).toHaveProperty('login');
          expect(credentials).toHaveProperty('password');
          expect(credentials).toHaveProperty('managebacSession');
          expect(credentials).toHaveProperty('cfduid');
          expect(credentials).toHaveProperty('authenticityToken');
          done();
        });
    });
  });

  db.connect(err => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    describe('POST /api/login', () => {
      test('POST /api/login should return 401 without credentials', (done) => {
        request(app)
          .post('/api/login')
          .then(response => {
            expect(response.statusCode).toBe(401);
            done();
          });
      });
  
      test('POST /api/login should return 200 with valid credentials', (done) => {
        request(app)
          .post('/api/login')
          .set('Content-Type', 'multipart/form-data')
          .field('login', process.env.LOGIN)
          .field('password', process.env.PASSWORD)
          .then(response => {
            expect(response.statusCode).toBe(200);
            done();
          });
      });
  
      test('POST /api/login should return 401 with invalid login', (done) => {
        request(app)
          .post('/api/login')
          .set('Content-Type', 'multipart/form-data')
          .field('login', 'foo@bar.com')
          .field('password', process.env.PASSWORD)
          .then(response => {
            expect(response.statusCode).toBe(401);
            done();
          });
      });
  
      test('POST /api/login should return 401 with invalid password', (done) => {
        request(app)
          .post('/api/login')
          .set('Content-Type', 'multipart/form-data')
          .field('login', process.env.LOGIN)
          .field('password', 'foobar')
          .then(response => {
            expect(response.statusCode).toBe(401);
            done();
          });
      });
  
      test('POST /api/login should return Login-Token with valid credentials', (done) => {
        request(app)
          .post('/api/login')
          .set('Content-Type', 'multipart/form-data')
          .field('login', process.env.LOGIN)
          .field('password', process.env.PASSWORD)
          .then(response => {
            const credentials = JSON.parse(response.headers['login-token'] || '{}');
            expect(credentials).toHaveProperty('login');
            expect(credentials).toHaveProperty('password');
            expect(credentials).toHaveProperty('managebacSession');
            expect(credentials).toHaveProperty('cfduid');
            expect(credentials).toHaveProperty('authenticityToken');
            expect(response.headers).toHaveProperty('sardonyx-token');
            done();
          });
      });
    });
  });
});