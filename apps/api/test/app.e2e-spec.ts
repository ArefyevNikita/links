import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { AppDataSource } from '../src/infrastructure/persistence/typeorm/data-source';

describe('App (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    process.env.DATABASE_NAME = 'url_shortener_test';
    process.env.BASE_URL = 'http://localhost:3001';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();

    if (AppDataSource.isInitialized) {
      await AppDataSource.query('TRUNCATE TABLE links RESTART IDENTITY CASCADE');
    }
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.query('TRUNCATE TABLE links RESTART IDENTITY CASCADE');
      await AppDataSource.destroy();
    }
    await app.close();
  });

  describe('/links (POST)', () => {
    it('should create a new link', () => {
      return request(app.getHttpServer())
        .post('/links')
        .send({
          originalUrl: 'https://example.com/test',
        })
        .expect(201)
        .expect((res: any) => {
          expect(res.body).toMatchObject({
            id: expect.any(String),
            slug: expect.any(String),
            shortUrl: expect.stringContaining('/r/'),
            originalUrl: 'https://example.com/test',
            clicks: 0,
            createdAt: expect.any(String),
            expiresAt: null,
          });
        });
    });

    it('should create a link with expiration date', () => {
      const expiresAt = '2025-12-31T23:59:59.000Z';
      
      return request(app.getHttpServer())
        .post('/links')
        .send({
          originalUrl: 'https://example.com/expires',
          expiresAt,
        })
        .expect(201)
        .expect((res: any) => {
          expect(res.body.expiresAt).toBe(expiresAt);
        });
    });

    it('should reject invalid URL', () => {
      return request(app.getHttpServer())
        .post('/links')
        .send({
          originalUrl: 'invalid-url',
        })
        .expect(400);
    });

    it('should reject past expiration date', () => {
      return request(app.getHttpServer())
        .post('/links')
        .send({
          originalUrl: 'https://example.com/test',
          expiresAt: '2020-01-01T00:00:00.000Z',
        })
        .expect(400);
    });
  });

  describe('/r/:slug (GET)', () => {
    let testSlug: string;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/links')
        .send({
          originalUrl: 'https://example.com/redirect-test',
        })
        .expect(201);

      testSlug = response.body.slug;
    });

    it('should redirect to original URL and increment clicks', async () => {
      await request(app.getHttpServer())
        .get(`/r/${testSlug}`)
        .expect(302)
        .expect('Location', 'https://example.com/redirect-test');

      const linksResponse = await request(app.getHttpServer())
        .get('/links?limit=10&offset=0')
        .expect(200);

      const link = linksResponse.body.links.find((l: any) => l.slug === testSlug);
      expect(link.clicks).toBe(1);
    });

    it('should return 404 for non-existent slug', () => {
      return request(app.getHttpServer())
        .get('/r/nonexistent')
        .expect(404);
    });

    it('should return 404 for expired link', async () => {
      const expiredResponse = await request(app.getHttpServer())
        .post('/links')
        .send({
          originalUrl: 'https://example.com/expired',
          expiresAt: '2020-01-01T00:00:00.000Z',
        });

      expect(expiredResponse.status).toBe(400);
    });
  });

  describe('/links (GET)', () => {
    beforeEach(async () => {
      await request(app.getHttpServer())
        .post('/links')
        .send({ originalUrl: 'https://example.com/1' });

      await request(app.getHttpServer())
        .post('/links')
        .send({ originalUrl: 'https://example.com/2' });

      await request(app.getHttpServer())
        .post('/links')
        .send({ originalUrl: 'https://example.com/3' });
    });

    it('should list links with default pagination', () => {
      return request(app.getHttpServer())
        .get('/links')
        .expect(200)
        .expect((res: any) => {
          expect(res.body.links).toBeInstanceOf(Array);
          expect(res.body.links.length).toBeGreaterThan(0);
          expect(res.body.links[0]).toMatchObject({
            id: expect.any(String),
            slug: expect.any(String),
            shortUrl: expect.any(String),
            originalUrl: expect.any(String),
            clicks: expect.any(Number),
            createdAt: expect.any(String),
          });
        });
    });

    it('should respect pagination parameters', () => {
      return request(app.getHttpServer())
        .get('/links?limit=2&offset=1')
        .expect(200)
        .expect((res: any) => {
          expect(res.body.links).toBeInstanceOf(Array);
          expect(res.body.links.length).toBeLessThanOrEqual(2);
        });
    });

    it('should reject invalid pagination parameters', () => {
      return request(app.getHttpServer())
        .get('/links?limit=0')
        .expect(400);
    });

    it('should reject negative offset', () => {
      return request(app.getHttpServer())
        .get('/links?offset=-1')
        .expect(400);
    });
  });

  describe('/links/:id (DELETE)', () => {
    let testLinkId: string;

    beforeEach(async () => {
      const response = await request(app.getHttpServer())
        .post('/links')
        .send({
          originalUrl: 'https://example.com/delete-test',
        })
        .expect(201);

      testLinkId = response.body.id;
    });

    it('should delete a link', () => {
      return request(app.getHttpServer())
        .delete(`/links/${testLinkId}`)
        .expect(200);
    });

    it('should return 404 for non-existent link', () => {
      return request(app.getHttpServer())
        .delete('/links/00000000-0000-0000-0000-000000000000')
        .expect(404);
    });

    it('should return 404 for invalid UUID', () => {
      return request(app.getHttpServer())
        .delete('/links/invalid-uuid')
        .expect(404);
    });
  });
});
