const request = require('supertest');
const app = require('../app');

require('dotenv').config();

jest.setTimeout(30000);

describe('Load CAS', () => {
  describe('GET /api/cas', () => {
    test('GET /api/cas should return valid tokens', done => {
      request(app)
        .get('/api/cas')
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(200);
          const credentials = JSON.parse(response.headers['login-token'] || '{}');
          expect(credentials).toHaveProperty('cfduid');
          expect(credentials).toHaveProperty('managebacSession');
          expect(credentials).toHaveProperty('csrfToken');
          done();
        });
    });

    test('GET /api/cas should return 401 with no tokens', done => {
      request(app)
        .get('/api/cas')
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });    

    test('GET /api/cas should return 401 with invalid tokens', done => {
      request(app)
        .get('/api/cas')
        .set('Login-Token', `{"cfduid": "foobar", "managebacSession": "foobar"}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /api/cas should return a valid json', done => {
      request(app)
        .get('/api/cas')
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          const cas = JSON.parse(response.headers['managebac-data']).cas;
          cas.forEach(item => {
            expect(typeof item.title).toBe('string');
            expect(typeof item.link).toBe('string');
            expect(typeof item.description).toBe('string');
            expect(Array.isArray(item.types)).toBeTruthy();
            expect(item.status).toMatch(/complete|approved|rejected|needs_approval/);
            expect(Array.isArray(item.labels)).toBeTruthy();
            expect(typeof item.project).toBe('boolean');
            expect(typeof item.commentCount).toBe('number');
            expect(typeof item.reflectionCount).toBe('string');
          });
          const documents = JSON.parse(response.headers['managebac-data']).documents;
          documents.forEach(item => {
            expect(typeof item.title).toBe('string');
            expect(typeof item.link).toBe('string');
            expect(typeof Date.parse(item.date)).toBe('number');
            expect(item.similarity).toBe(null);
          });
          done();
        });
    });
  });

  describe('GET /api/cas/:resourceId/overview', () => {
    test('GET /api/cas/:resourceId/overview should return valid tokens', done => {
      request(app)
        .get(`/api/cas/${process.env.CAS_ID}/overview`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(200);
          const credentials = JSON.parse(response.headers['login-token'] || '{}');
          expect(credentials).toHaveProperty('cfduid');
          expect(credentials).toHaveProperty('managebacSession');
          expect(credentials).toHaveProperty('csrfToken');
          done();
        });
    });

    test('GET /api/cas/:resourceId/overview should return 401 with no tokens', done => {
      request(app)
        .get(`/api/cas/${process.env.CAS_ID}/overview`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });    

    test('GET /api/cas/:resourceId/overview should return 401 with invalid tokens', done => {
      request(app)
        .get(`/api/cas/${process.env.CAS_ID}/overview`)
        .set('Login-Token', `{"cfduid": "foobar", "managebacSession": "foobar"}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /api/cas/:resourceId/overview should return 401 with invalid resourceId', done => {
      request(app)
        .get(`/api/cas/foobar/overview`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /api/cas/:resourceId/overview should return a valid json', done => {
      request(app)
        .get(`/api/cas/${process.env.CAS_ID}/overview`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          const cas = JSON.parse(response.headers['managebac-data']).cas;
          expect(typeof cas.title).toBe('string');
          expect(typeof cas.link).toBe('string');
          expect(cas.description).toBe(null);
          expect(Array.isArray(cas.types)).toBeTruthy();
          expect(cas.status).toMatch(/complete|approved|rejected|needs_approval/);
          expect(Array.isArray(cas.labels)).toBeTruthy();
          expect(typeof cas.project).toBe('boolean');
          expect(typeof cas.commentCount).toBe('number');
          expect(cas.reflectionCount).toBe(null);
          done();
        });
    }); 
  });

  describe('GET /api/cas/:resourceId/answers', () => {
    test('GET /api/cas/:resourceId/answers should return valid tokens', done => {
      request(app)
        .get(`/api/cas/${process.env.CAS_ID}/answers`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(200);
          const credentials = JSON.parse(response.headers['login-token'] || '{}');
          expect(credentials).toHaveProperty('cfduid');
          expect(credentials).toHaveProperty('managebacSession');
          expect(credentials).toHaveProperty('csrfToken');
          done();
        });
    });

    test('GET /api/cas/:resourceId/answers should return 401 with no tokens', done => {
      request(app)
        .get(`/api/cas/${process.env.CAS_ID}/answers`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });    

    test('GET /api/cas/:resourceId/answers should return 401 with invalid tokens', done => {
      request(app)
        .get(`/api/cas/${process.env.CAS_ID}/answers`)
        .set('Login-Token', `{"cfduid": "foobar", "managebacSession": "foobar"}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /api/cas/:resourceId/answers should return 401 with invalid resourceId', done => {
      request(app)
        .get(`/api/cas/foobar/answers`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /api/cas/:resourceId/answers should return a valid json', done => {
      request(app)
        .get(`/api/cas/${process.env.CAS_ID}/answers`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          const answers = JSON.parse(response.headers['managebac-data']).answers;
          expect(Array.isArray(answers)).toBeTruthy();
          expect(answers.length).toBe(3);
          answers.forEach(item => {
            expect(typeof item.question).toBe('string');
            expect(typeof item.answer).toBe('string');
          });
          done();
        });
    }); 
  });

  describe('GET /api/cas/:resourceId/reflections', () => {
    test('GET /api/cas/:resourceId/reflections should return valid tokens', done => {
      request(app)
        .get(`/api/cas/${process.env.CAS_ID}/reflections`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(200);
          const credentials = JSON.parse(response.headers['login-token'] || '{}');
          expect(credentials).toHaveProperty('cfduid');
          expect(credentials).toHaveProperty('managebacSession');
          expect(credentials).toHaveProperty('csrfToken');
          done();
        });
    });

    test('GET /api/cas/:resourceId/reflections should return 401 with no tokens', done => {
      request(app)
        .get(`/api/cas/${process.env.CAS_ID}/reflections`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });    

    test('GET /api/cas/:resourceId/reflections should return 401 with invalid tokens', done => {
      request(app)
        .get(`/api/cas/${process.env.CAS_ID}/reflections`)
        .set('Login-Token', `{"cfduid": "foobar", "managebacSession": "foobar"}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /api/cas/:resourceId/reflections should return 401 with invalid resourceId', done => {
      request(app)
        .get(`/api/cas/foobar/reflections`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /api/cas/:resourceId/reflections should return a valid json', done => {
      request(app)
        .get(`/api/cas/${process.env.CAS_ID}/reflections`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          const reflections = JSON.parse(response.headers['managebac-data']).reflections;
          reflections.forEach(item => {
            expect(Array.isArray(item.labels)).toBeTruthy();
            expect(item.type).toMatch(/reflection|link|photo|other/); // Other for types not supported (file and video)
            if (item.type === 'reflection') expect(typeof item.content).toBe('string');
            else if (item.type === 'link') {
              expect(typeof item.title).toBe('string');
              expect(typeof item.link).toBe('string');
              expect(typeof item.description).toBe('string');
            } else if (item.type === 'photo') {
              expect(Array.isArray(item.photos)).toBeTruthy();
              item.photos.forEach(photo => {
                expect(typeof photo.title).toBe('string');
                expect(typeof photo.link).toBe('string');
              });
            } else {
              expect(item.content).toBe('Sardonyx: This type of evidence is not supported yet.');
            }
          });
          done();
        });
    }); 
  });
});