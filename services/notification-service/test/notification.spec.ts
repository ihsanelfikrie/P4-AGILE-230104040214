import request from 'supertest';
import app from '../src/index';

describe('GET /notifications', () => {
  it('should return 401 without bearer token', async () => {
    const res = await request(app).get('/notifications');
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('code', 'UNAUTHORIZED');
  });

  it('should return 200 with valid token', async () => {
    const res = await request(app).get('/notifications?limit=5').set('Authorization', 'Bearer test123');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('notifications');
    expect(Array.isArray(res.body.notifications)).toBe(true);
  });
});