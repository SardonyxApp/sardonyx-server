const request = require('supertest');
const app = require('../app');

require('dotenv').config();

jest.setTimeout(30000);

describe('Load assignment', () => {
  describe('GET /api/class/:resourceId/assignments/:subresourceId', () => {
    test('GET /api/class/:resourceId/assignments/:subresourceId should return valid tokens', done => {
      request(app)
        .get(`/api/class/${process.env.CLASS_ID}/assignments/${process.env.CLASS_ASSIGNMENT_ID}`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}", "csrfToken": "${process.env.CSRF_TOKEN}"}`)
        .then(response => {
          expect(response.statusCode).toBe(200);
          const credentials = JSON.parse(response.headers['login-token'] || '{}');
          expect(credentials).toHaveProperty('cfduid');
          expect(credentials).toHaveProperty('managebacSession');
          expect(credentials).toHaveProperty('csrfToken');
          done();
        });
    });

    test('GET /api/class/:resourceId/assignments/:subresourceId should return 401 with no tokens', done => {
      request(app)
        .get(`/api/class/${process.env.CLASS_ID}/assignments/${process.env.CLASS_ASSIGNMENT_ID}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });    

    test('GET /api/class/:resourceId/assignments/:subresourceId should return 401 with invalid tokens', done => {
      request(app)
        .get(`/api/class/${process.env.CLASS_ID}/assignments/${process.env.CLASS_ASSIGNMENT_ID}`)
        .set('Login-Token', `{"cfduid": "foobar", "managebacSession": "foobar"}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /api/class/:resourceId/assignments/:subresourceId should return 401 with invalid resourceId', done => {
      request(app)
        .get(`/api/class/foobar/assignments/${process.env.CLASS_ASSIGNMENT_ID}`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /api/class/:resourceId/assignments/:subresourceId should return 401 with invalid subresourceId', done => {
      request(app)
        .get(`/api/class/${process.env.CLASS_ID}/assignments/foobar`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /api/class/:resourceId/assignments/:subresourceId should return a valid json', done => {
      request(app)
        .get(`/api/class/${process.env.CLASS_ID}/assignments/${process.env.CLASS_ASSIGNMENT_ID}`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          const assignment = JSON.parse(response.headers['managebac-data']).assignment;
          expect(typeof assignment.title).toBe('string');
          expect(assignment.link).toBeFalsy();
          expect(Array.isArray(assignment.labels)).toBeTruthy();
          expect(assignment.deadline).toBeFalsy();
          expect(typeof assignment.due).toBe('string');
          expect(typeof Date.parse(assignment.due)).toBe('number');
          expect(assignment.author).toBeFalsy();
          expect(assignment.avatar).toBeFalsy();
          expect(typeof assignment.details).toBe('string');
          expect(Array.isArray(assignment.attachments)).toBeTruthy();
          expect(Array.isArray(assignment.dropbox)).toBeTruthy();
          assignment.dropbox.forEach(item => {
            expect(typeof item.title).toBe('string');
            expect(typeof item.link).toBe('string');
            expect(typeof item.date).toBe('string');
            expect(typeof Date.parse(item.date)).toBe('number');
            expect(typeof item.similarity === 'number' || item.similarity === null).toBeTruthy();
          });
          assignment.messages.forEach(item => {
            expect(typeof item.title).toBe('string');
            expect(typeof item.link).toBe('string');
            expect(typeof item.content).toBe('string');
            expect(typeof item.author).toBe('string');
            expect(typeof item.avatar === 'string' || item.avatar === null).toBeTruthy();
            expect(typeof item.date).toBe('string');
            expect(typeof Date.parse(item.date)).toBe('number');
            expect(Array.isArray(item.files)).toBeTruthy();
          });
          done();
        });
    });
  });
});