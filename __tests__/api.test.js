const request = require('supertest');
const app = require('../app');

describe('Random API', () => {
  describe('GET /random', () => {
    test('GET /random should return 401 or 200', (done) => {
      request(app)
        .get('/random')
        .then(response => {
          expect(response.statusCode === 200 || response.statusCode === 401).toBeTruthy();
          done();
        });
    });
  });
});

describe('CORS', () => {
  test('GET /api should have Access-Control-Allow-Origin set to *', (done) => {
    request(app)
      .get('/api')
      .then(response => {
        expect(response.headers['access-control-allow-origin']).toBe('*');
        done();
      });
  });
});