import request from 'supertest';
import app from '../src/index';

describe('POST /orders', () => {
  it('should return 401 without bearer token', async () => {
    const res = await request(app).post('/orders').send({ productId: 'PROD-001', quantity: 2 });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('code', 'UNAUTHORIZED');
  });

  it('should return 400 for invalid payload', async () => {
    const res = await request(app)
      .post('/orders')
      .set('Authorization', 'Bearer test123')
      .send({ productId: '', quantity: 0 });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('code', 'VALIDATION_ERROR');
  });

  it('should return 201 for valid order', async () => {
    const res = await request(app)
      .post('/orders')
      .set('Authorization', 'Bearer test123')
      .send({ productId: 'PROD-001', quantity: 2 });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('status', 'created');
  });
});