import { ResolveSlugUseCase } from '../ResolveSlugUseCase';
import { ILinkRepository } from '../../../domain/repositories/ILinkRepository';
import { Link } from '../../../domain/entities/Link';

describe('ResolveSlugUseCase', () => {
  let resolveSlugUseCase: ResolveSlugUseCase;
  let mockLinkRepository: jest.Mocked<ILinkRepository>;

  beforeEach(() => {
    mockLinkRepository = {
      save: jest.fn(),
      findById: jest.fn(),
      findBySlug: jest.fn(),
      findAll: jest.fn(),
      delete: jest.fn(),
      isSlugUnique: jest.fn(),
    };

    resolveSlugUseCase = new ResolveSlugUseCase(mockLinkRepository);
  });

  describe('execute', () => {
    it('should resolve slug and increment clicks', async () => {
      const slug = 'test123';
      const originalUrl = 'https://example.com/test';
      const mockLink = new Link(
        'test-id',
        slug,
        originalUrl,
        new Date(),
        null,
        5,
      );

      const updatedLink = mockLink.incrementClicks();

      mockLinkRepository.findBySlug.mockResolvedValue(mockLink);
      mockLinkRepository.save.mockResolvedValue(updatedLink);

      const result = await resolveSlugUseCase.execute(slug);

      expect(result).toBe(originalUrl);
      expect(mockLinkRepository.findBySlug).toHaveBeenCalledWith(slug);
      expect(mockLinkRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          clicks: 6,
        }),
      );
    });

    it('should throw error when link not found', async () => {
      const slug = 'nonexistent';
      mockLinkRepository.findBySlug.mockResolvedValue(null);

      await expect(resolveSlugUseCase.execute(slug)).rejects.toThrow(
        'Link not found',
      );

      expect(mockLinkRepository.findBySlug).toHaveBeenCalledWith(slug);
      expect(mockLinkRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error when link is expired', async () => {
      const slug = 'expired123';
      const expiredDate = new Date('2020-01-01');
      const mockLink = new Link(
        'test-id',
        slug,
        'https://example.com/test',
        new Date(),
        expiredDate,
        0,
      );

      mockLinkRepository.findBySlug.mockResolvedValue(mockLink);

      await expect(resolveSlugUseCase.execute(slug)).rejects.toThrow(
        'Link has expired',
      );

      expect(mockLinkRepository.findBySlug).toHaveBeenCalledWith(slug);
      expect(mockLinkRepository.save).not.toHaveBeenCalled();
    });

    it('should resolve non-expired link with expiration date', async () => {
      const slug = 'future123';
      const futureDate = new Date('2025-12-31');
      const originalUrl = 'https://example.com/test';
      const mockLink = new Link(
        'test-id',
        slug,
        originalUrl,
        new Date(),
        futureDate,
        0,
      );

      const updatedLink = mockLink.incrementClicks();

      mockLinkRepository.findBySlug.mockResolvedValue(mockLink);
      mockLinkRepository.save.mockResolvedValue(updatedLink);

      const result = await resolveSlugUseCase.execute(slug);

      expect(result).toBe(originalUrl);
      expect(mockLinkRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          clicks: 1,
        }),
      );
    });
  });
});
