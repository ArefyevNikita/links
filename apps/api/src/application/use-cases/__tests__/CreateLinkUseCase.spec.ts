import { CreateLinkUseCase } from '../CreateLinkUseCase';
import { ILinkRepository } from '../../../domain/repositories/ILinkRepository';
import { SlugService } from '../../../domain/services/SlugService';
import { Link } from '../../../domain/entities/Link';
import { Slug } from '../../../domain/value-objects/Slug';

describe('CreateLinkUseCase', () => {
  let createLinkUseCase: CreateLinkUseCase;
  let mockLinkRepository: jest.Mocked<ILinkRepository>;
  let mockSlugService: jest.Mocked<SlugService>;

  const BASE_URL = 'http://localhost:3001';

  beforeEach(() => {
    mockLinkRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findBySlug: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
      isSlugUnique: jest.fn(),
    };

    mockSlugService = {
      generateUniqueSlug: jest.fn(),
    } as any;

    createLinkUseCase = new CreateLinkUseCase(
      mockLinkRepository,
      mockSlugService,
      BASE_URL,
    );
  });

  describe('execute', () => {
    it('should create a link successfully', async () => {
      const request = {
        originalUrl: 'https://example.com/test',
      };

      const mockSlug = new Slug('test123');
      const mockLink = Link.create(
        'test-id',
        mockSlug.getValue(),
        request.originalUrl,
      );

      mockSlugService.generateUniqueSlug.mockResolvedValue(mockSlug);
      mockLinkRepository.save.mockResolvedValue(mockLink);

      const result = await createLinkUseCase.execute(request);

      expect(result).toEqual({
        id: mockLink.id,
        slug: mockLink.slug,
        shortUrl: `${BASE_URL}/r/${mockLink.slug}`,
        originalUrl: mockLink.originalUrl,
        clicks: mockLink.clicks,
        createdAt: mockLink.createdAt,
        expiresAt: mockLink.expiresAt,
      });

      expect(mockSlugService.generateUniqueSlug).toHaveBeenCalledTimes(1);
      expect(mockLinkRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          slug: mockSlug.getValue(),
          originalUrl: request.originalUrl,
        }),
      );
    });

    it('should create a link with expiration date', async () => {
      const expiresAt = new Date('2025-12-31');
      const request = {
        originalUrl: 'https://example.com/test',
        expiresAt,
      };

      const mockSlug = new Slug('test123');
      const mockLink = Link.create(
        'test-id',
        mockSlug.getValue(),
        request.originalUrl,
        expiresAt,
      );

      mockSlugService.generateUniqueSlug.mockResolvedValue(mockSlug);
      mockLinkRepository.save.mockResolvedValue(mockLink);

      const result = await createLinkUseCase.execute(request);

      expect(result.expiresAt).toEqual(expiresAt);
    });

    it('should throw error for invalid URL', async () => {
      const request = {
        originalUrl: 'invalid-url',
      };

      await expect(createLinkUseCase.execute(request)).rejects.toThrow(
        'Invalid URL format',
      );

      expect(mockSlugService.generateUniqueSlug).not.toHaveBeenCalled();
      expect(mockLinkRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error for past expiration date', async () => {
      const pastDate = new Date('2020-01-01');
      const request = {
        originalUrl: 'https://example.com/test',
        expiresAt: pastDate,
      };

      await expect(createLinkUseCase.execute(request)).rejects.toThrow(
        'Expiration date must be in the future',
      );

      expect(mockSlugService.generateUniqueSlug).not.toHaveBeenCalled();
      expect(mockLinkRepository.save).not.toHaveBeenCalled();
    });
  });
});
