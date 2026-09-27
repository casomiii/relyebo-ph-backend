const request = require('supertest');
const app = require('../../src/app');
const { v4: uuidv4 } = require('uuid');

describe('Task 2 Integration Tests', () => {
  beforeEach(async () => {
    await request(app).delete('/api/v1/jobs');
  });

  describe('Idempotency (count=1)', () => {
    it('should only increment jobs count once for the same idempotency key', async () => {
      const idempotencyKey = uuidv4();
      const mockUser = { id: 'test-user', verification_status: 'VERIFIED' };
      const payload = { gps: { lat: 10.0, lng: 20.0 } };

      const res1 = await request(app)
        .post('/api/v1/jobs')
        .set('x-mock-user', JSON.stringify(mockUser))
        .set('x-idempotency-key', idempotencyKey)
        .send(payload);

      expect(res1.status).toBe(201);

      const countRes1 = await request(app).get('/api/v1/jobs/count');
      expect(countRes1.body.count).toBe(1);

      const res2 = await request(app)
        .post('/api/v1/jobs')
        .set('x-mock-user', JSON.stringify(mockUser))
        .set('x-idempotency-key', idempotencyKey)
        .send(payload);

      expect(res2.status).toBe(201);

      const countRes2 = await request(app).get('/api/v1/jobs/count');
      expect(countRes2.body.count).toBe(1); // Still 1
    });
  });

  describe('State Machine (PENDING + REJECT others)', () => {
    const payload = { gps: { lat: 10.0, lng: 20.0 } };

    it('should reject PENDING state with 403', async () => {
      const mockUser = { id: 'test', verification_status: 'PENDING' };
      const res = await request(app)
        .post('/api/v1/jobs')
        .set('x-mock-user', JSON.stringify(mockUser))
        .send(payload);
      expect(res.status).toBe(403);
    });

    it('should reject REJECTED state with 403', async () => {
      const mockUser = { id: 'test', verification_status: 'REJECTED' };
      const res = await request(app)
        .post('/api/v1/jobs')
        .set('x-mock-user', JSON.stringify(mockUser))
        .send(payload);
      expect(res.status).toBe(403);
    });

    it('should accept APPROVED state with 201', async () => {
      const mockUser = { id: 'test', verification_status: 'APPROVED' };
      const res = await request(app)
        .post('/api/v1/jobs')
        .set('x-mock-user', JSON.stringify(mockUser))
        .send(payload);
      expect(res.status).toBe(201);
    });

    it('should accept VERIFIED state with 201', async () => {
      const mockUser = { id: 'test', verification_status: 'VERIFIED' };
      const res = await request(app)
        .post('/api/v1/jobs')
        .set('x-mock-user', JSON.stringify(mockUser))
        .send(payload);
      expect(res.status).toBe(201);
    });
  });

  describe('GPS 400 rejection', () => {
    it('should reject requests without GPS data', async () => {
      const mockUser = { id: 'test', verification_status: 'VERIFIED' };
      const res = await request(app)
        .post('/api/v1/jobs')
        .set('x-mock-user', JSON.stringify(mockUser))
        .send({});
      expect(res.status).toBe(400);
    });

    it('should reject requests with invalid GPS data', async () => {
      const mockUser = { id: 'test', verification_status: 'VERIFIED' };
      const res = await request(app)
        .post('/api/v1/jobs')
        .set('x-mock-user', JSON.stringify(mockUser))
        .send({ gps: { lat: 'invalid', lng: 20.0 } });
      expect(res.status).toBe(400);
    });
  });
});
