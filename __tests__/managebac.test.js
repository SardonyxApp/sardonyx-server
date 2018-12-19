const request = require('supertest');
const app = require('../app');

require('dotenv').config();

jest.setTimeout(30000);

describe('Load default', () => {
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

describe('Load class', () => {
  describe('GET /api/class/:resourceId/overview', () => {
    test('GET /api/class/:resourceId/overview should return valid cookies', done => {
      request(app)
        .get(`/api/class/${process.env.CLASS_ID}/overview`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(200);
          const credentials = JSON.parse(response.headers['login-token'] || '{}');
          expect(credentials).toHaveProperty('cfduid');
          expect(credentials).toHaveProperty('managebacSession');
          done();
        });
    });

    test('GET /api/class/:resourceId/overview should return 401 with no cookies', done => {
      request(app)
        .get(`/api/class/${process.env.CLASS_ID}/overview`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });    

    test('GET /api/class/:resourceId/overview should return 401 with invalid cookies', done => {
      request(app)
        .get(`/api/class/${process.env.CLASS_ID}/overview`)
        .set('Login-Token', `{"cfduid": "foobar", "managebacSession": "foobar"}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /api/class/:resourceId/overview should return 401 with invalid resourceId', done => {
      request(app)
        .get(`/api/class/foobar/overview`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /api/class/:resourceId/overview should return a valid deadlines json', done => {
      request(app)
        .get(`/api/class/${process.env.CLASS_ID}/overview`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
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

  describe('GET /api/class/:resourceId/assignments', () => {
    test('GET /api/class/:resourceId/assignments should return valid cookies', done => {
      request(app)
        .get(`/api/class/${process.env.CLASS_ID}/assignments`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(200);
          const credentials = JSON.parse(response.headers['login-token'] || '{}');
          expect(credentials).toHaveProperty('cfduid');
          expect(credentials).toHaveProperty('managebacSession');
          done();
        });
    });

    test('GET /api/class/:resourceId/assignments should return 401 with no cookies', done => {
      request(app)
        .get(`/api/class/${process.env.CLASS_ID}/assignments`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });    

    test('GET /api/class/:resourceId/assignments should return 401 with invalid cookies', done => {
      request(app)
        .get(`/api/class/${process.env.CLASS_ID}/assignments`)
        .set('Login-Token', `{"cfduid": "foobar", "managebacSession": "foobar"}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /api/class/:resourceId/assignments should return 401 with invalid resourceId', done => {
      request(app)
        .get(`/api/class/foobar/assignments`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /api/class/:resourceId/assignments should return a valid json', done => {
      request(app)
        .get(`/api/class/${process.env.CLASS_ID}/assignments`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          const dataObj = JSON.parse(response.headers['managebac-data']);
          dataObj.upcoming.concat(dataObj.completed).forEach(item => {
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

  describe('GET /api/class/:resourceId/messages', () => {
    test('GET /api/class/:resourceId/messages should return valid cookies', done => {
      request(app)
        .get(`/api/class/${process.env.CLASS_ID}/messages`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(200);
          const credentials = JSON.parse(response.headers['login-token'] || '{}');
          expect(credentials).toHaveProperty('cfduid');
          expect(credentials).toHaveProperty('managebacSession');
          done();
        });
    });

    test('GET /api/class/:resourceId/messages should return 401 with no cookies', done => {
      request(app)
        .get(`/api/class/${process.env.CLASS_ID}/messages`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });    

    test('GET /api/class/:resourceId/messages should return 401 with invalid cookies', done => {
      request(app)
        .get(`/api/class/${process.env.CLASS_ID}/messages`)
        .set('Login-Token', `{"cfduid": "foobar", "managebacSession": "foobar"}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /api/class/:resourceId/messages should return 401 with invalid resourceId', done => {
      request(app)
        .get(`/api/class/foobar/messages`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /api/class/:resourceId/messages should return a valid json', done => {
      request(app)
        .get(`/api/class/${process.env.CLASS_ID}/messages`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          const messages = JSON.parse(response.headers['managebac-data']).messages;
          messages.forEach(item => {
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

describe('Load group', () => {
  describe('GET /api/group/:resourceId/overview', () => {
    test('GET /api/group/:resourceId/overview should return valid cookies', done => {
      request(app)
        .get(`/api/group/${process.env.GROUP_ID}/overview`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(200);
          const credentials = JSON.parse(response.headers['login-token'] || '{}');
          expect(credentials).toHaveProperty('cfduid');
          expect(credentials).toHaveProperty('managebacSession');
          done();
        });
    });

    test('GET /api/group/:resourceId/overview should return 401 with no cookies', done => {
      request(app)
        .get(`/api/group/${process.env.GROUP_ID}/overview`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });    

    test('GET /api/group/:resourceId/overview should return 401 with invalid cookies', done => {
      request(app)
        .get(`/api/group/${process.env.GROUP_ID}/overview`)
        .set('Login-Token', `{"cfduid": "foobar", "managebacSession": "foobar"}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /api/group/:resourceId/overview should return 401 with invalid resourceId', done => {
      request(app)
        .get(`/api/group/foobar/overview`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
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

  describe('GET /api/group/:resourceId/messages', () => {
    test('GET /api/group/:resourceId/messages should return valid cookies', done => {
      request(app)
        .get(`/api/group/${process.env.GROUP_ID}/messages`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(200);
          const credentials = JSON.parse(response.headers['login-token'] || '{}');
          expect(credentials).toHaveProperty('cfduid');
          expect(credentials).toHaveProperty('managebacSession');
          done();
        });
    });

    test('GET /api/group/:resourceId/messages should return 401 with no cookies', done => {
      request(app)
        .get(`/api/group/${process.env.GROUP_ID}/messages`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });    

    test('GET /api/group/:resourceId/messages should return 401 with invalid cookies', done => {
      request(app)
        .get(`/api/group/${process.env.GROUP_ID}/messages`)
        .set('Login-Token', `{"cfduid": "foobar", "managebacSession": "foobar"}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /api/group/:resourceId/messages should return 401 with invalid resourceId', done => {
      request(app)
        .get(`/api/group/foobar/messages`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
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

describe('Load message', () => {
  describe('GET /api/class/:resourceId/messages/:destinationId', () => {
    test('GET /api/class/:resourceId/messages should return valid cookies', done => {
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
          expect(typeof message[0].avatar === 'string' || message[0].avatar === false).toBeTruthy();
          expect(typeof message[0].date).toBe('string');
          expect(typeof Date.parse(message[0].date)).toBe('number');
          expect(Array.isArray(message[0].files)).toBeTruthy();
          expect(message[0]).toHaveProperty('comments');
          message[0].comments.forEach(item => {
            expect(typeof item.title).toBe('string');
            expect(typeof item.content).toBe('string');
            expect(typeof item.author).toBe('string');
            expect(typeof item.avatar === 'string' || item.avatar === false).toBeTruthy();
            expect(typeof item.date).toBe('string');
            expect(typeof Date.parse(item.date)).toBe('number');
          });
          done();
        });
    });
  });

  describe('GET /api/group/:resourceId/messages/:destinationId', () => {
    test('GET /api/group/:resourceId/messages should return valid cookies', done => {
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
          expect(typeof message[0].avatar === 'string' || message[0].avatar === false).toBeTruthy();
          expect(typeof message[0].date).toBe('string');
          expect(typeof Date.parse(message[0].date)).toBe('number');
          expect(Array.isArray(message[0].files)).toBeTruthy();
          expect(message[0]).toHaveProperty('comments');
          message[0].comments.forEach(item => {
            expect(typeof item.title).toBe('string');
            expect(typeof item.content).toBe('string');
            expect(typeof item.author).toBe('string');
            expect(typeof item.avatar === 'string' || item.avatar === false).toBeTruthy();
            expect(typeof item.date).toBe('string');
            expect(typeof Date.parse(item.date)).toBe('number');
          });
          done();
        });
    });
  });
});

describe('Load notifications', () => {
  describe('GET /api/notification', () => {
    test('GET /api/notification should return valid cookies', done => {
      request(app)
        .get('/api/notification')
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(200);
          const credentials = JSON.parse(response.headers['login-token'] || '{}');
          expect(credentials).toHaveProperty('cfduid');
          expect(credentials).toHaveProperty('managebacSession');
          done();
        });
    });

    test('GET /api/notification should return 401 with no cookies', done => {
      request(app)
        .get('/api/notification')
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });    

    test('GET /api/notification should return 401 with invalid cookies', done => {
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
          const notifications= JSON.parse(response.headers['managebac-data']).notifications;
          notifications.forEach(item => {
            expect(typeof item.title).toBe('string');
            expect(typeof item.link).toBe('string');
            expect(typeof item.author).toBe('string');
            expect(typeof item.dateString).toBe('string');
            expect(typeof item.unread).toBe('boolean');
          });
          done();
        });
    });
  });
});

describe('Load notification', () => {
  describe('GET /api/notification/:resourceId', () => {
    test('GET /api/notification should return valid cookies', done => {
      request(app)
        .get(`/api/notification/${process.env.NOTIFICATION_ID}`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(200);
          const credentials = JSON.parse(response.headers['login-token'] || '{}');
          expect(credentials).toHaveProperty('cfduid');
          expect(credentials).toHaveProperty('managebacSession');
          done();
        });
    });

    test('GET /api/notification should return 401 with no cookies', done => {
      request(app)
        .get(`/api/notification/${process.env.NOTIFICATION_ID}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });    

    test('GET /api/notification should return 401 with invalid cookies', done => {
      request(app)
        .get(`/api/notification/${process.env.NOTIFICATION_ID}`)
        .set('Login-Token', `{"cfduid": "foobar", "managebacSession": "foobar"}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });

    test('GET /api/notification/:resourceId should return 401 with invalid resourceId', done => {
      request(app)
        .get(`/api/notification/foobar`)
        .set('Login-Token', `{"cfduid": "${process.env.CFDUID}", "managebacSession": "${process.env.MANAGEBAC_SESSION}"}`)
        .then(response => {
          expect(response.statusCode).toBe(401);
          done();
        });
    });
  });
});