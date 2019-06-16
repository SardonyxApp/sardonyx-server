const request = require('supertest');
const app = require('../app');

require('dotenv').config();

jest.setTimeout(30000);

describe('Load notifications', () => {
  describe('GET /api/notification', () => {
    test('GET /api/notification should return valid tokens', done => {
      request(app)
        .get('/api/notification')
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

    test('GET /api/notification should return 401 with no tokens', done => {
      request(app)
        .get('/api/notification')
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });    

    test('GET /api/notification should return 401 with invalid tokens', done => {
      request(app)
        .get('/api/notification')
        .set('Login-Token', `{"cfduid": "foobar", "managebacSession": "foobar"}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /api/notification should return a valid json', done => {
      request(app)
        .get('/api/notification')
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          const notifications= response.body.notifications;
          notifications.forEach(item => {
            expect(typeof item.id).toBe('number');
            expect(isNaN(item.id)).toBeFalsy();
            expect(typeof item.title).toBe('string');
            expect(typeof item.link).toBe('string');
            expect(typeof item.author).toBe('string');
            expect(typeof item.dateString).toBe('string');
            expect(typeof item.unread).toBe('boolean');
          });
          expect(response.body).toHaveProperty('numberOfPages');
          done();
        });
    });
  });

  describe('GET /api/notification?pageId=:pageId', () => {
    test('GET /api/notification?pageId=:pageId should return valid tokens', done => {
      request(app)
        .get(`/api/notification?pageId=${process.env.NOTIFICATION_PAGE_ID}`)
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

    test('GET /api/notification?pageId=:pageId should return 401 with no tokens', done => {
      request(app)
        .get(`/api/notification?pageId=${process.env.NOTIFICATION_PAGE_ID}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });    

    test('GET /api/notification?pageId=:pageId should return 401 with invalid tokens', done => {
      request(app)
        .get(`/api/notification?pageId=${process.env.NOTIFICATION_PAGE_ID}`)
        .set('Login-Token', `{"cfduid": "foobar", "managebacSession": "foobar"}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /api/notification?pageId=:pageId should return a valid json', done => {
      request(app)
        .get(`/api/notification?pageId=${process.env.NOTIFICATION_PAGE_ID}`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          const notifications= response.body.notifications;
          notifications.forEach(item => {
            expect(typeof item.id).toBe('number');
            expect(isNaN(item.id)).toBeFalsy();
            expect(typeof item.title).toBe('string');
            expect(typeof item.link).toBe('string');
            expect(typeof item.author).toBe('string');
            expect(typeof item.dateString).toBe('string');
            expect(typeof item.unread).toBe('boolean');
          });
          expect(response.body).toHaveProperty('numberOfPages');
          done();
        });
    });
  });});

describe('Load notification', () => {
  describe('GET /api/notification/:resourceId', () => {
    test('GET /api/notification/:resourceId should return valid tokens', done => {
      request(app)
        .get(`/api/notification/${process.env.NOTIFICATION_ID}`)
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

    test('GET /api/notification/:resourceId should return 401 with no tokens', done => {
      request(app)
        .get(`/api/notification/${process.env.NOTIFICATION_ID}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });    

    test('GET /api/notification/:resourceId should return 401 with invalid tokens', done => {
      request(app)
        .get(`/api/notification/${process.env.NOTIFICATION_ID}`)
        .set('Login-Token', `{"cfduid": "foobar", "managebacSession": "foobar"}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /api/notification/:resourceId should return 400 with invalid resourceId', done => {
      request(app)
        .get(`/api/notification/foobar`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(400);
          done();
        });
    });

    test('GET /api/notification/:resourceId shoudl return a valid json', done => {
      request(app)
        .get(`/api/notification/${process.env.NOTIFICATION_ID}`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          const notification = response.body.notification;
          expect(typeof notification.title).toBe('string');
          expect(typeof notification.author).toBe('string');
          expect(typeof notification.date).toBe('string');
          expect(isNaN(Date.parse(notification.date))).toBeFalsy();
          expect(typeof notification.content).toBe('string');
          done();
        });
    });
  });
});