const request = require('supertest');
const app = require('../app');

require('dotenv').config();

jest.setTimeout(30000);

describe('Load assignment', () => {
  describe('GET /api/class/:resourceId/assignments/:destinationId', () => {
    test('GET /api/class/:resourceId/assignments should return valid cookies', done => {
      request(app)
        .get(`/api/class/${process.env.CLASS_ID}/assignments/${process.env.CLASS_ASSIGNMENT_ID}`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(200);
          const credentials = JSON.parse(response.headers['login-token'] || '{}');
          expect(credentials).toHaveProperty('cfduid');
          expect(credentials).toHaveProperty('managebacSession');
          done();
        });
    });

    test('GET /api/class/:resourceId/assignments/:destinationId should return 401 with no cookies', done => {
      request(app)
        .get(`/api/class/${process.env.CLASS_ID}/assignments/${process.env.CLASS_ASSIGNMENT_ID}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });    

    test('GET /api/class/:resourceId/assignments/:destinationId should return 401 with invalid cookies', done => {
      request(app)
        .get(`/api/class/${process.env.CLASS_ID}/assignments/${process.env.CLASS_ASSIGNMENT_ID}`)
        .set('Login-Token', `{"cfduid": "foobar", "managebacSession": "foobar"}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /api/class/:resourceId/assignments/:destinationId should return 401 with invalid resourceId', done => {
      request(app)
        .get(`/api/class/foobar/assignments/${process.env.CLASS_ASSIGNMENT_ID}`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /api/class/:resourceId/assignments/:destinationId should return 401 with invalid destinationId', done => {
      request(app)
        .get(`/api/class/${process.env.CLASS_ID}/assignments/foobar`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /api/class/:resourceId/assignments/:destinationId should return a valid json', done => {
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
            expect(typeof item.similarity).toBe('number');
          });
          assignment.messages.forEach(item => {
            expect(typeof item.title).toBe('string');
            expect(typeof item.link).toBe('string');
            expect(typeof item.content).toBe('string');
            expect(typeof item.author).toBe('string');
            expect(typeof item.avatar === 'string' || item.avatar === false).toBeTruthy();
            expect(typeof item.date).toBe('string');
            expect(typeof Date.parse(item.date)).toBe('number');
            expect(Array.isArray(item.files)).toBeTruthy();
          });
          done();
        });
    });
  });
});