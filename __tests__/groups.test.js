const request = require('supertest');
const app = require('../app');

require('dotenv').config();

jest.setTimeout(30000);

describe('Load group', () => {
  describe('GET /api/group/:resourceId/overview', () => {
    test('GET /api/group/:resourceId/overview should return valid tokens', done => {
      request(app)
        .get(`/api/group/${process.env.GROUP_ID}/overview`)
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

    test('GET /api/group/:resourceId/overview should return 401 with no tokens', done => {
      request(app)
        .get(`/api/group/${process.env.GROUP_ID}/overview`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });    

    test('GET /api/group/:resourceId/overview should return 401 with invalid tokens', done => {
      request(app)
        .get(`/api/group/${process.env.GROUP_ID}/overview`)
        .set('Login-Token', `{"cfduid": "foobar", "managebacSession": "foobar"}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /api/group/:resourceId/overview should return 400 with invalid resourceId', done => {
      request(app)
        .get(`/api/group/foobar/overview`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(400);
          done();
        });
    });

    test('GET /api/group/:resourceId/overview should return a valid deadlines json', done => {
      request(app)
        .get(`/api/group/${process.env.GROUP_ID}/overview`)
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
  });

  describe('GET /api/group/:resourceId/messages', () => {
    test('GET /api/group/:resourceId/messages should return valid tokens', done => {
      request(app)
        .get(`/api/group/${process.env.GROUP_ID}/messages`)
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

    test('GET /api/group/:resourceId/messages should return 401 with no tokens', done => {
      request(app)
        .get(`/api/group/${process.env.GROUP_ID}/messages`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });    

    test('GET /api/group/:resourceId/messages should return 401 with invalid tokens', done => {
      request(app)
        .get(`/api/group/${process.env.GROUP_ID}/messages`)
        .set('Login-Token', `{"cfduid": "foobar", "managebacSession": "foobar"}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /api/group/:resourceId/messages should return 400 with invalid resourceId', done => {
      request(app)
        .get(`/api/group/foobar/messages`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(400);
          done();
        });
    });

    test('GET /api/group/:resourceId/messages should return a valid json', done => {
      request(app)
        .get(`/api/group/${process.env.GROUP_ID}/messages`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          const messages = JSON.parse(response.headers['managebac-data']).messages;
          messages.forEach(item => {
            expect(typeof item.id).toBe('number');
            expect(isNaN(item.id)).toBeFalsy();
            expect(typeof item.title).toBe('string');
            expect(typeof item.link).toBe('string');
            expect(typeof item.content).toBe('string');
            expect(typeof item.author).toBe('string');
            expect(typeof item.avatar === 'string' || item.avatar === null).toBeTruthy();
            expect(typeof item.date).toBe('string');
            expect(isNaN(Date.parse(item.date))).toBeFalsy();
            expect(Array.isArray(item.files)).toBeTruthy();
            expect(typeof item.comments === 'number' || (Array.isArray(item.comments) && item.comments.length === 0)).toBeTruthy(); 
            // When all class messages do not have comments, the number of comments are not displayed. Due to this, the API will return an empty array.
          });
          expect(JSON.parse(response.headers['managebac-data'])).toHaveProperty('numberOfPages');
          done();
        });
    });
  });

  describe('GET /api/group/:resourceId/messages?pageParam=:pageParam', () => {
    test('GET /api/group/:resourceId/messages?pageParam=:pageParam should return valid tokens', done => {
      request(app)
        .get(`/api/group/${process.env.GROUP_ID}/messages?pageParam=${process.env.GROUP_MESSAGE_PAGE_ID}`)
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

    test('GET /api/group/:resourceId/messages?pageParam=:pageParam should return 401 with no tokens', done => {
      request(app)
        .get(`/api/group/${process.env.GROUP_ID}/messages?pageParam=${process.env.GROUP_MESSAGE_PAGE_ID}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });    

    test('GET /api/group/:resourceId/messages?pageParam=:pageParam should return 401 with invalid tokens', done => {
      request(app)
        .get(`/api/group/${process.env.GROUP_ID}/messages?pageParam=${process.env.GROUP_MESSAGE_PAGE_ID}`)
        .set('Login-Token', `{"cfduid": "foobar", "managebacSession": "foobar"}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /api/group/:resourceId/messages?pageParam=:pageParam should return 400 with invalid resourceId', done => {
      request(app)
        .get(`/api/group/foobar/messages?pageParam=${process.env.GROUP_MESSAGE_PAGE_ID}`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(400);
          done();
        });
    });

    test('GET /api/group/:resourceId/messages?pageParam=:pageParam should return a valid json', done => {
      request(app)
        .get(`/api/group/${process.env.GROUP_ID}/messages?pageParam=${process.env.GROUP_MESSAGE_PAGE_ID}`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          const messages = JSON.parse(response.headers['managebac-data']).messages;
          messages.forEach(item => {
            expect(typeof item.id).toBe('number');
            expect(isNaN(item.id)).toBeFalsy();
            expect(typeof item.title).toBe('string');
            expect(typeof item.link).toBe('string');
            expect(typeof item.content).toBe('string');
            expect(typeof item.author).toBe('string');
            expect(typeof item.avatar === 'string' || item.avatar === null).toBeTruthy();
            expect(typeof item.date).toBe('string');
            expect(isNaN(Date.parse(item.date))).toBeFalsy();
            expect(Array.isArray(item.files)).toBeTruthy();
            expect(typeof item.comments === 'number' || (Array.isArray(item.comments) && item.comments.length === 0)).toBeTruthy(); 
            // When all class messages do not have comments, the number of comments are not displayed. Due to this, the API will return an empty array.
          });
          expect(JSON.parse(response.headers['managebac-data'])).toHaveProperty('numberOfPages');
          done();
        });
    });
  });
});