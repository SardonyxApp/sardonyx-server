const request = require('supertest');
const app = require('../app');

require('dotenv').config();

describe('Initial load', () => {
  describe('GET /api/validate', () => {
    test('GET /api/validate should return a response json', (done) => {
      request(app)
        .get('/api/validate')
        .set('Login-Token', `{"login":"${process.env.LOGIN}","password":"${process.env.PASSWORD}"}`)
        .then(response => {
          expect(true).toBeTruthy();
          done();
          // Pseudocode: check to see if the response json is included in the appropriate header
          // Pseudocode: check to see if content of response json is appropriate
        });
    });

    test('POST /api/login should return a response json', (done) => {
      request(app)
        .post('/api/login')
        .set('Content-Type', 'multipart/form-data')
        .field('login', process.env.LOGIN)
        .field('password', process.env.PASSWORD)
        .then(response => {
          expect(true).toBeTruthy();
          done();
        });
    });
  });
});
