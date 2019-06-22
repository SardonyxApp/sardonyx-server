const request = require('supertest');
const app = require('../app');

require('dotenv').config();

jest.setTimeout(30000);

describe('Load message', () => {
  describe('GET /api/class/:resourceId/messages/:subresourceId', () => {
    test('GET /api/class/:resourceId/messages/:subresourceId should return valid tokens', done => {
      request(app)
        .get(`/api/class/${process.env.CLASS_ID}/messages/${process.env.CLASS_MESSAGE_ID}`)
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

    test('GET /api/class/:resourceId/messages/:subresourceId should return 401 with no tokens', done => {
      request(app)
        .get(`/api/class/${process.env.CLASS_ID}/messages/${process.env.CLASS_MESSAGE_ID}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });    

    test('GET /api/class/:resourceId/messages/:subresourceId should return 401 with invalid tokens', done => {
      request(app)
        .get(`/api/class/${process.env.CLASS_ID}/messages/${process.env.CLASS_MESSAGE_ID}`)
        .set('Login-Token', `{"cfduid": "foobar", "managebacSession": "foobar"}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /api/class/:resourceId/messages/:subresourceId should return 400 with invalid resourceId', done => {
      request(app)
        .get(`/api/class/foobar/messages/${process.env.CLASS_MESSAGE_ID}`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(400);
          done();
        });
    });

    test('GET /api/class/:resourceId/messages/:subresourceId should return 400 with invalid subresourceId', done => {
      request(app)
        .get(`/api/class/${process.env.CLASS_ID}/messages/foobar`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(400);
          done();
        });
    });

    test('GET /api/class/:resourceId/messages/:subresourceId should return a valid json', done => {
      request(app)
        .get(`/api/class/${process.env.CLASS_ID}/messages/${process.env.CLASS_MESSAGE_ID}`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          const message = response.body.message;
          expect(typeof message[0].id).toBe('number');
          expect(isNaN(message[0].id)).toBeFalsy();
          expect(typeof message[0].title).toBe('string');
          expect(typeof message[0].link).toBe('string');
          expect(typeof message[0].content).toBe('string');
          expect(typeof message[0].onlyVisibleForTeachers).toBe('boolean');
          expect(typeof message[0].author).toBe('string');
          expect(typeof message[0].authorId).toBe('number');
          expect(typeof message[0].avatar === 'string' || message[0].avatar === null).toBeTruthy();
          expect(typeof message[0].date).toBe('string');
          expect(isNaN(Date.parse(message[0].date))).toBeFalsy();
          expect(Array.isArray(message[0].files)).toBeTruthy();
          expect(Array.isArray(message[0].comments)).toBeTruthy();
          message[0].comments.forEach(item => {
            expect(typeof item.id).toBe('number');
            expect(isNaN(item.id)).toBeFalsy();
            expect(typeof item.content).toBe('string');
            expect(typeof item.onlyVisibleForTeachers).toBe('boolean');
            expect(typeof item.author).toBe('string');
            expect(typeof item.authorId).toBe('number');
            expect(typeof item.avatar === 'string' || item.avatar === null).toBeTruthy();
            expect(typeof item.date).toBe('string');
            expect(isNaN(Date.parse(item.date))).toBeFalsy();
            expect(typeof item.comments).toBe('boolean');
            item.files.forEach(file => {
              expect(typeof file).toBe('string');
            });
          });
          done();
        });
    });
  });

  describe('GET /api/group/:resourceId/messages/:subresourceId', () => {
    test('GET /api/group/:resourceId/messages/:subresourceId should return valid tokens', done => {
      request(app)
        .get(`/api/group/${process.env.GROUP_ID}/messages/${process.env.GROUP_MESSAGE_ID}`)
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

    test('GET /api/group/:resourceId/messages/:subresourceId should return 401 with no tokens', done => {
      request(app)
        .get(`/api/group/${process.env.GROUP_ID}/messages/${process.env.GROUP_MESSAGE_ID}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });    

    test('GET /api/group/:resourceId/messages/:subresourceId should return 401 with invalid tokens', done => {
      request(app)
        .get(`/api/group/${process.env.GROUP_ID}/messages/${process.env.GROUP_MESSAGE_ID}`)
        .set('Login-Token', `{"cfduid": "foobar", "managebacSession": "foobar"}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /api/group/:resourceId/messages/:subresourceId should return 400 with invalid resourceId', done => {
      request(app)
        .get(`/api/group/foobar/messages/${process.env.GROUP_MESSAGE_ID}`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(400);
          done();
        });
    });

    test('GET /api/group/:resourceId/messages/:subresourceId should return 400 with invalid subresourceId', done => {
      request(app)
        .get(`/api/group/${process.env.GROUP_ID}/messages/foobar`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(400);
          done();
        });
    });

    test('GET /api/group/:resourceId/messages/:subresourceId should return a valid json', done => {
      request(app)
        .get(`/api/group/${process.env.GROUP_ID}/messages/${process.env.GROUP_MESSAGE_ID}`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          const message = response.body.message;
          expect(typeof message[0].id).toBe('number');
          expect(isNaN(message[0].id)).toBeFalsy();
          expect(typeof message[0].title).toBe('string');
          expect(typeof message[0].link).toBe('string');
          expect(typeof message[0].content).toBe('string');
          expect(typeof message[0].onlyVisibleForTeachers).toBe('boolean');
          expect(typeof message[0].author).toBe('string');
          expect(typeof message[0].authorId).toBe('number');
          expect(typeof message[0].avatar === 'string' || message[0].avatar === null).toBeTruthy();
          expect(typeof message[0].date).toBe('string');
          expect(isNaN(Date.parse(message[0].date))).toBeFalsy();
          expect(Array.isArray(message[0].files)).toBeTruthy();
          expect(Array.isArray(message[0].comments)).toBeTruthy();
          message[0].comments.forEach(item => {
            expect(typeof item.id).toBe('number');
            expect(isNaN(item.id)).toBeFalsy();
            expect(typeof item.content).toBe('string');
            expect(typeof item.onlyVisibleForTeachers).toBe('boolean');
            expect(typeof item.author).toBe('string');
            expect(typeof item.authorId).toBe('number');
            expect(typeof item.avatar === 'string' || item.avatar === null).toBeTruthy();
            expect(typeof item.date).toBe('string');
            expect(isNaN(Date.parse(item.date))).toBeFalsy();
            expect(typeof item.comments).toBe('boolean');
            item.files.forEach(file => {
              expect(typeof file).toBe('string');
            });
          });
          done();
        });
    });
  });

  // GET /api/class/:resourceId/messages/:subresourceId/reply/:subitemId is not tested 

  // Due to environment variable conflicts, below tests are not conducted by default. Uncomment them and test them with proper environment variables.  

  // describe('GET /api/group/:resourceId/messages/:subresourceId/reply/:subitemId', () => {
  //   test('GET /api/group/:resourceId/messages/:subresourceId/reply/:subitemId should return valid tokens', done => {
  //     request(app)
  //       .get(`/api/group/${process.env.GROUP_ID}/messages/${process.env.GROUP_MESSAGE_ID}/reply/${process.env.GROUP_REPLY_OF_REPLY_ID}`)
  //       .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
  //       .then(response => {
  //         expect(response.statusCode).toBe(200);
  //         const credentials = JSON.parse(response.headers['login-token'] || '{}');
  //         expect(credentials).toHaveProperty('cfduid');
  //         expect(credentials).toHaveProperty('managebacSession');
  //         // no Authenticity Token for JavaScript responses 
  //         done();
  //       });
  //   });

  //   test('GET /api/group/:resourceId/messages/:subresourceId/reply/:subitemId should return 401 with no tokens', done => {
  //     request(app)
  //       .get(`/api/group/${process.env.GROUP_ID}/messages/${process.env.GROUP_MESSAGE_ID}/reply/${process.env.GROUP_REPLY_OF_REPLY_ID}`)
  //       .then(response => {
  //         expect(response.statusCode).toBe(401);
  //         done();
  //       });
  //   });    

  //   test('GET /api/group/:resourceId/messages/:subresourceId/reply/:subitemId should return 401 with invalid tokens', done => {
  //     request(app)
  //       .get(`/api/group/${process.env.GROUP_ID}/messages/${process.env.GROUP_MESSAGE_ID}/reply/${process.env.GROUP_REPLY_OF_REPLY_ID}`)
  //       .set('Login-Token', `{"cfduid": "foobar", "managebacSession": "foobar"}`)
  //       .then(response => {
  //         expect(response.statusCode).toBe(401);
  //         done();
  //       });
  //   });

  //   test('GET /api/group/:resourceId/messages/:subresourceId/reply/:subitemId should return 400 with invalid resourceId', done => {
  //     request(app)
  //       .get(`/api/group/foobar/messages/${process.env.GROUP_MESSAGE_ID}/reply/${process.env.GROUP_REPLY_OF_REPLY_ID}`)
  //       .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
  //       .then(response => {
  //         expect(response.statusCode).toBe(400);
  //         done();
  //       });
  //   });

  //   test('GET /api/group/:resourceId/messages/:subresourceId/reply/:subitemId should return 400 with invalid subresourceId', done => {
  //     request(app)
  //       .get(`/api/group/${process.env.GROUP_ID}/messages/foobar/reply/${process.env.GROUP_REPLY_OF_REPLY_ID}`)
  //       .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
  //       .then(response => {
  //         expect(response.statusCode).toBe(400);
  //         done();
  //       });
  //   });

  //   test('GET /api/group/:resourceId/messages/:subresourceId/reply/:subitemId should return 400 with invalid subitemId', done => {
  //     request(app)
  //       .get(`/api/group/${process.env.GROUP_ID}/messages/${process.env.GROUP_MESSAGE_ID}/reply/foobar`)
  //       .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
  //       .then(response => {
  //         expect(response.statusCode).toBe(400);
  //         done();
  //       });
  //   });

  //   test('GET /api/group/:resourceId/messages/:subresourceId/reply/:subitemId should return a valid json', done => {
  //     request(app)
  //       .get(`/api/group/${process.env.GROUP_ID}/messages/${process.env.GROUP_MESSAGE_ID}/reply/${process.env.GROUP_REPLY_OF_REPLY_ID}`)
  //       .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
  //       .then(response => {
  //         const replyOfReply = response.body.replyOfReply;
  //         replyOfReply.forEach(item => {
  //           expect(typeof item.id).toBe('number');
  //           expect(isNaN(item.id)).toBeFalsy();
  //           expect(typeof item.content).toBe('string');
  //           expect(typeof item.onlyVisibleForTeachers).toBe('boolean');
  //           expect(typeof item.author).toBe('string');
  //           expect(typeof item.avatar === 'string' || item.avatar === null).toBeTruthy();
  //           expect(typeof item.date).toBe('string');
  //           expect(isNaN(Date.parse(item.date))).toBeFalsy();
  //           item.files.forEach(file => {
  //             expect(typeof file).toBe('string');
  //           });
  //         });
  //         done();
  //       });
  //   });
  // });
});