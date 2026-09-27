const request = require('supertest');
const app = require('../../src/app');

describe('checkSoftGate Middleware', () => {
  it('should return 401 Unauthorized if no x-mock-user header is provided', async () => {
    const res = await request(app)
      .post('/api/v1/jobs')
      .send({ gps: { lat: 0, lng: 0 } });
    expect(res.status).toBe(401);
  });

  it('should return 403 Forbidden if user has PENDING status', async () => {
    const mockUser = { id: 'test', verification_status: 'PENDING' };
    const res = await request(app)
      .post('/api/v1/jobs')
      .set('x-mock-user', JSON.stringify(mockUser))
      .send({ gps: { lat: 0, lng: 0 } });
    expect(res.status).toBe(403);
  });

  it('should return 201 Created if user has APPROVED status', async () => {
    const mockUser = { id: 'test', verification_status: 'APPROVED' };
    const res = await request(app)
      .post('/api/v1/jobs')
      .set('x-mock-user', JSON.stringify(mockUser))
      .send({ gps: { lat: 0, lng: 0 } });
    expect(res.status).toBe(201);
  });

  it('should return 201 Created if user has VERIFIED status', async () => {
    const mockUser = { id: 'test', verification_status: 'VERIFIED' };
    const res = await request(app)
      .post('/api/v1/jobs')
      .set('x-mock-user', JSON.stringify(mockUser))
      .send({ gps: { lat: 0, lng: 0 } });
    expect(res.status).toBe(201);
  });

  it('should allow GET requests even if user has PENDING status', async () => {
    const mockUser = { id: 'test', verification_status: 'PENDING' };
    const res = await request(app)
      .get('/api/v1/jobs/count')
      .set('x-mock-user', JSON.stringify(mockUser));
    expect(res.status).toBe(200);
  });
});
