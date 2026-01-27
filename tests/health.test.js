/**
 * Health Check API Tests
 */

const request = require('supertest');
const app = require('../server');

describe('Health Check API', () => {
  describe('GET /api/health', () => {
    it('should return 200 and health status', async () => {
      const response = await request(app).get('/api/health').expect(200);

      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('environment');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('database');
    });

    it('should have database connection info', async () => {
      const response = await request(app).get('/api/health');

      expect(response.body.database).toHaveProperty('status');
      expect(['connected', 'disconnected']).toContain(response.body.database.status);
    });

    it('should return uptime as a number', async () => {
      const response = await request(app).get('/api/health');

      expect(typeof response.body.uptime).toBe('number');
      expect(response.body.uptime).toBeGreaterThan(0);
    });

    it('should include timestamp in ISO format', async () => {
      const response = await request(app).get('/api/health');

      const timestamp = new Date(response.body.timestamp);
      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.getTime()).not.toBeNaN();
    });
  });
});
