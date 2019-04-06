const request = require('supertest');
const app = require('../app');

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