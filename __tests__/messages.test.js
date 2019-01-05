const request = require('supertest');
const app = require('../app');

require('dotenv').config();

jest.setTimeout(30000);

describe('Load message', () => {
  describe('GET /api/class/:resourceId/messages/:destinationId', () => {
    test('GET /api/class/:resourceId/messages/:destinationId should return valid cookies', done => {
      request(app)
        .get(`/api/class/${process.env.CLASS_ID}/messages/${process.env.CLASS_MESSAGE_ID}`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(200);
          const credentials = JSON.parse(response.headers['login-token'] || '{}');
          expect(credentials).toHaveProperty('cfduid');
          expect(credentials).toHaveProperty('managebacSession');
          done();
        });
    });

    test('GET /api/class/:resourceId/messages/:destinationId should return 401 with no cookies', done => {
      request(app)
        .get(`/api/class/${process.env.CLASS_ID}/messages/${process.env.CLASS_MESSAGE_ID}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });    

    test('GET /api/class/:resourceId/messages/:destinationId should return 401 with invalid cookies', done => {
      request(app)
        .get(`/api/class/${process.env.CLASS_ID}/messages/${process.env.CLASS_MESSAGE_ID}`)
        .set('Login-Token', `{"cfduid": "foobar", "managebacSession": "foobar"}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /api/class/:resourceId/messages/:destinationId should return 401 with invalid resourceId', done => {
      request(app)
        .get(`/api/class/foobar/messages/${process.env.CLASS_MESSAGE_ID}`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /api/class/:resourceId/messages/:destinationId should return 401 with invalid destinationId', done => {
      request(app)
        .get(`/api/class/${process.env.CLASS_ID}/messages/foobar`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /api/class/:resourceId/messages/:destinationId should return a valid json', done => {
      request(app)
        .get(`/api/class/${process.env.CLASS_ID}/messages/${process.env.CLASS_MESSAGE_ID}`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          const message = JSON.parse(response.headers['managebac-data']).message;
          expect(typeof message[0].title).toBe('string');
          expect(typeof message[0].link).toBe('string');
          expect(typeof message[0].content).toBe('string');
          expect(typeof message[0].author).toBe('string');
          expect(typeof message[0].avatar === 'string' || message[0].avatar === null).toBeTruthy();
          expect(typeof message[0].date).toBe('string');
          expect(typeof Date.parse(message[0].date)).toBe('number');
          expect(Array.isArray(message[0].files)).toBeTruthy();
          expect(message[0]).toHaveProperty('comments');
          message[0].comments.forEach(item => {
            expect(typeof item.title).toBe('string');
            expect(typeof item.content).toBe('string');
            expect(typeof item.author).toBe('string');
            expect(typeof item.avatar === 'string' || item.avatar === null).toBeTruthy();
            expect(typeof item.date).toBe('string');
            expect(typeof Date.parse(item.date)).toBe('number');
          });
          done();
        });
    });
  });

  describe('GET /api/group/:resourceId/messages/:destinationId', () => {
    test('GET /api/group/:resourceId/messages/:destinationId should return valid cookies', done => {
      request(app)
        .get(`/api/group/${process.env.GROUP_ID}/messages/${process.env.GROUP_MESSAGE_ID}`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(200);
          const credentials = JSON.parse(response.headers['login-token'] || '{}');
          expect(credentials).toHaveProperty('cfduid');
          expect(credentials).toHaveProperty('managebacSession');
          done();
        });
    });

    test('GET /api/group/:resourceId/messages/:destinationId should return 401 with no cookies', done => {
      request(app)
        .get(`/api/group/${process.env.GROUP_ID}/messages/${process.env.GROUP_MESSAGE_ID}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });    

    test('GET /api/group/:resourceId/messages/:destinationId should return 401 with invalid cookies', done => {
      request(app)
        .get(`/api/group/${process.env.GROUP_ID}/messages/${process.env.GROUP_MESSAGE_ID}`)
        .set('Login-Token', `{"cfduid": "foobar", "managebacSession": "foobar"}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /api/group/:resourceId/messages/:destinationId should return 401 with invalid resourceId', done => {
      request(app)
        .get(`/api/group/foobar/messages/${process.env.GROUP_MESSAGE_ID}`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /api/group/:resourceId/messages/:destinationId should return 401 with invalid destinationId', done => {
      request(app)
        .get(`/api/group/${process.env.GROUP_ID}/messages/foobar`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /api/group/:resourceId/messages/:destinationId should return a valid json', done => {
      request(app)
        .get(`/api/group/${process.env.GROUP_ID}/messages/${process.env.GROUP_MESSAGE_ID}`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          const message = JSON.parse(response.headers['managebac-data']).message;
          expect(typeof message[0].title).toBe('string');
          expect(typeof message[0].link).toBe('string');
          expect(typeof message[0].content).toBe('string');
          expect(typeof message[0].author).toBe('string');
          expect(typeof message[0].avatar === 'string' || message[0].avatar === null).toBeTruthy();
          expect(typeof message[0].date).toBe('string');
          expect(typeof Date.parse(message[0].date)).toBe('number');
          expect(Array.isArray(message[0].files)).toBeTruthy();
          expect(message[0]).toHaveProperty('comments');
          message[0].comments.forEach(item => {
            expect(typeof item.title).toBe('string');
            expect(typeof item.content).toBe('string');
            expect(typeof item.author).toBe('string');
            expect(typeof item.avatar === 'string' || item.avatar === null).toBeTruthy();
            expect(typeof item.date).toBe('string');
            expect(typeof Date.parse(item.date)).toBe('number');
          });
          done();
        });
    });
  });
});