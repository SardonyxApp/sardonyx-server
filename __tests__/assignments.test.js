const request = require('supertest');
const app = require('../app');

require('dotenv').config();

jest.setTimeout(30000);

describe('Load assignment or event', () => {
  describe('GET /api/class/:resourceId/assignments/:subresourceId', () => {
    test('GET /api/class/:resourceId/assignments/:subresourceId should return valid tokens', done => {
      request(app)
        .get(`/api/class/${process.env.CLASS_ID}/assignments/${process.env.CLASS_ASSIGNMENT_ID}`)
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

    test('GET /api/class/:resourceId/assignments/:subresourceId should return 400 with invalid resourceId', done => {
      request(app)
        .get(`/api/class/foobar/assignments/${process.env.CLASS_ASSIGNMENT_ID}`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(400);
          done();
        });
    });
    test('GET /api/class/:resourceId/assignments/:subresourceId should return 400 with invalid subresourceId', done => {
      request(app)
        .get(`/api/class/${process.env.CLASS_ID}/assignments/foobar`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(400);
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
          expect(assignment.link).toBeNull();
          expect(assignment.deadline).toBe(false);
          expect(typeof assignment.due).toBe('string');
          expect(typeof Date.parse(assignment.due)).toBe('number');
          expect(typeof assignment.author).toBe('string');
          expect(typeof assignment.avatar === 'string' || assignment.avatar === null).toBeTruthy();
          expect(assignment).toHaveProperty('details');
          expect(Array.isArray(assignment.attachments)).toBeTruthy();
          assignment.attachments.forEach(item => {
            expect(typeof item.name).toBe('string');
            expect(typeof item.link).toBe('string');
          });
          expect(Array.isArray(assignment.dropbox)).toBeTruthy();
          assignment.dropbox.forEach(item => {
            expect(typeof item.title).toBe('string');
            expect(typeof item.link).toBe('string');
            expect(typeof item.date).toBe('string');
            expect(typeof Date.parse(item.date)).toBe('number');
            expect(typeof item.similarity === 'number' || item.similarity === null).toBeTruthy();
          });
          expect(Array.isArray(assignment.dropbox)).toBeTruthy();
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

  describe('GET /api/event/:resourceId', () => {
    test('GET /api/event/:resourceId should return valid tokens', done => {
      request(app)
        .get(`/api/event/${process.env.EVENT_ID}`)
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

    test('GET /api/event/:resourceId should return 401 with no tokens', done => {
      request(app)
        .get(`/api/event/${process.env.EVENT_ID}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });    

    test('GET /api/event/:resourceId should return 401 with invalid tokens', done => {
      request(app)
        .get(`/api/event/${process.env.EVENT_ID}`)
        .set('Login-Token', `{"cfduid": "foobar", "managebacSession": "foobar"}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /api/event/:resourceId should return 400 with invalid resourceId', done => {
      request(app)
        .get(`/api/event/foobar`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(400);
          done();
        });
    });

    test('GET /api/event/:resourceId should return a valid json', done => {
      request(app)
        .get(`/api/event/${process.env.EVENT_ID}`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          const assignment = JSON.parse(response.headers['managebac-data']).assignment;
          expect(typeof assignment.title).toBe('string');
          expect(assignment.link).toBeNull();
          expect(Array.isArray(assignment.labels)).toBeTruthy();
          expect(typeof assignment.deadline).toBe('boolean');
          expect(typeof assignment.due).toBe('string');
          expect(typeof Date.parse(assignment.due)).toBe('number');
          expect(typeof assignment.author).toBe('string');
          expect(typeof assignment.avatar === 'string' || assignment.avatar === null).toBeTruthy();
          expect(assignment).toHaveProperty('details');
          expect(Array.isArray(assignment.attachments)).toBeTruthy();
          assignment.attachments.forEach(item => {
            expect(typeof item.name).toBe('string');
            expect(typeof item.link).toBe('string');
          });
          expect(Array.isArray(assignment.dropbox)).toBeTruthy();
          assignment.dropbox.forEach(item => {
            expect(typeof item.title).toBe('string');
            expect(typeof item.link).toBe('string');
            expect(typeof item.date).toBe('string');
            expect(typeof Date.parse(item.date)).toBe('number');
            expect(typeof item.similarity === 'number' || item.similarity === null).toBeTruthy();
          });
          expect(Array.isArray(assignment.messages)).toBeTruthy();
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

  // Not going to test GET /api/class/:resourceId/events/:subresourceId, because no events under classes exist, yet.

  describe('GET /api/group/:resourceId/events/:subresourceId', () => {
    test('GET /api/group/:resourceId/events/:subresourceId should return valid tokens', done => {
      request(app)
        .get(`/api/group/${process.env.GROUP_ID}/events/${process.env.GROUP_EVENT_ID}`)
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

    test('GET /api/group/:resourceId/events/:subresourceId should return 401 with no tokens', done => {
      request(app)
        .get(`/api/group/${process.env.GROUP_ID}/events/${process.env.GROUP_EVENT_ID}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });    

    test('GET /api/group/:resourceId/events/:subresourceId should return 401 with invalid tokens', done => {
      request(app)
        .get(`/api/group/${process.env.GROUP_ID}/events/${process.env.GROUP_EVENT_ID}`)
        .set('Login-Token', `{"cfduid": "foobar", "managebacSession": "foobar"}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /api/group/:resourceId/events/:subresourceId should return 400 with invalid resourceId', done => {
      request(app)
        .get(`/api/group/foobar/events/${process.env.GROUP_EVENT_ID}`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(400);
          done();
        });
    });

    test('GET /api/group/:resourceId/events/:subresourceId should return 400 with invalid subresourceId', done => {
      request(app)
        .get(`/api/group/${process.env.GROUP_ID}/events/foobar`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(400);
          done();
        });
    });

    test('GET /api/group/:resourceId/events/:subresourceId should return a valid json', done => {
      request(app)
        .get(`/api/group/${process.env.GROUP_ID}/events/${process.env.GROUP_EVENT_ID}`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          const assignment = JSON.parse(response.headers['managebac-data']).assignment;
          expect(typeof assignment.title).toBe('string');
          expect(assignment.link).toBeNull();
          expect(Array.isArray(assignment.labels)).toBeTruthy();
          expect(typeof assignment.deadline).toBe('boolean');
          expect(typeof assignment.due).toBe('string');
          expect(typeof Date.parse(assignment.due)).toBe('number');
          expect(typeof assignment.author).toBe('string');
          expect(typeof assignment.avatar === 'string' || assignment.avatar === null).toBeTruthy();
          expect(assignment).toHaveProperty('details');
          expect(Array.isArray(assignment.attachments)).toBeTruthy();
          assignment.attachments.forEach(item => {
            expect(typeof item.name).toBe('string');
            expect(typeof item.link).toBe('string');
          });
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