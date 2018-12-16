const request = require('supertest');
const app = require('../app');

require('dotenv').config();

describe('Initial load', () => {
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
  })
});

describe('Load deadlines', () => {
  describe('GET /api/validate', () => {
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
  });

  describe('POST /api/login', () => {
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
  });
});

describe('Load classes', () => {
  describe('GET /api/validate', () => {
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
  });

  describe('POST /api/login', () => {
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
  });
});

describe('Load groups', () => {
  describe('GET /api/validate', () => {
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
  });

  describe('POST /api/login', () => {
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
  });
});

describe('Load notification count', () => {
  describe('GET /api/validate', () => {
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

describe('Load single resource', () => {
  describe('GET /api/class/:classId', () => {
    test('GET /api/class/:classId should return valid cookies', done => {
      request(app)
        .get(`/api/class/${process.env.CLASS_ID}`)
        .set('Login-Token', `{"cfduid": "${process.env.cfduid}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(200);
          const credentials = JSON.parse(response.headers['login-token'] || '{}');
          expect(credentials).toHaveProperty('cfduid');
          expect(credentials).toHaveProperty('managebacSession');
          done();
        });
    });

    test('GET /api/class/:classId should return 302 with no cookies', done => {
      request(app)
        .get(`/api/class/${process.env.CLASS_ID}`)
        .then(response => {
          expect(response.statusCode).toBe(302);
          done();
        });
    });    

    test('GET /api/class/:classId should return 302 with invalid cookies', done => {
      request(app)
        .get(`/api/class/${process.env.CLASS_ID}`)
        .set('Login-Token', `{"cfduid": "foobar", "managebacSession": "foobar"}`)
        .then(response => {
          expect(response.statusCode).toBe(302);
          done();
        });
    });

    test('GET /api/class/:classId should return 401 with invalid classId', done => {
      request(app)
        .get(`/api/class/foobar`)
        .set('Login-Token', `{"cfduid": "${process.env.cfduid}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(302);
          done();
        });
    });
  });
});