const request = require('supertest');
const app = require('../app');

require('dotenv').config();

jest.setTimeout(30000);

describe('Load CAS', () => {
  describe('GET /api/cas', () => {
    test('GET /api/cas should return valid cookies', done => {
      request(app)
        .get('/api/cas')
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(200);
          const credentials = JSON.parse(response.headers['login-token'] || '{}');
          expect(credentials).toHaveProperty('cfduid');
          expect(credentials).toHaveProperty('managebacSession');
          done();
        });
    });

    test('GET /api/cas should return 401 with no cookies', done => {
      request(app)
        .get('/api/cas')
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });    

    test('GET /api/cas should return 401 with invalid cookies', done => {
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

  describe('GET /api/cas/:resourceId', () => {
    test('GET /api/cas should return valid cookies', done => {
      request(app)
        .get(`/api/cas/${process.env.CAS_ID}`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(200);
          const credentials = JSON.parse(response.headers['login-token'] || '{}');
          expect(credentials).toHaveProperty('cfduid');
          expect(credentials).toHaveProperty('managebacSession');
          done();
        });
    });

    test('GET /api/cas/:resourceId should return 401 with no cookies', done => {
      request(app)
        .get(`/api/cas/${process.env.CAS_ID}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });    

    test('GET /api/cas/:resourceId should return 401 with invalid cookies', done => {
      request(app)
        .get(`/api/cas/${process.env.CAS_ID}`)
        .set('Login-Token', `{"cfduid": "foobar", "managebacSession": "foobar"}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });
  });
});