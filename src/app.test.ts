import app from './app';
import request from 'supertest';

describe('GET /', () => {
  describe('home route', () => {
    test('should respond with a 200 status code', async () => {
      const response = await request(app).get('/')
      expect(response.statusCode).toBe(200)
    });
    test('should respond with "This is your reminder"', async () => {
      const response = await request(app).get('/')
      expect(response.text).toBe('This is your reminder')
    });
  });
});