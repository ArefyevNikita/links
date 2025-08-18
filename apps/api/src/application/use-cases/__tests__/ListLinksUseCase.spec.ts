import { ListLinksUseCase } from '../ListLinksUseCase';
import { ILinkRepository } from '../../../domain/repositories/ILinkRepository';
import { Link } from '../../../domain/entities/Link';

describe('ListLinksUseCase', () => {
  let listLinksUseCase: ListLinksUseCase;
  let mockLinkRepository: jest.Mocked<ILinkRepository>;

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

    listLinksUseCase = new ListLinksUseCase(mockLinkRepository, BASE_URL);
  });

  describe('execute', () => {
    it('should list links successfully', async () => {
      const request = { limit: 10, offset: 0 };
      const mockLinks = [
        new Link(
          'id1',
          'slug1',
          'https://example.com/1',
          new Date('2023-01-01'),
          null,
          5,
        ),
        new Link(
          'id2',
          'slug2',
          'https://example.com/2',
          new Date('2023-01-02'),
          new Date('2024-12-31'),
          3,
        ),
      ];

      mockLinkRepository.findAll.mockResolvedValue(mockLinks);

      const result = await listLinksUseCase.execute(request);

      expect(result.links).toHaveLength(2);
      expect(result.links[0]).toEqual({
        id: 'id1',
        slug: 'slug1',
        shortUrl: `${BASE_URL}/r/slug1`,
        originalUrl: 'https://example.com/1',
        clicks: 5,
        createdAt: new Date('2023-01-01'),
        expiresAt: null,
      });
      expect(result.links[1]).toEqual({
        id: 'id2',
        slug: 'slug2',
        shortUrl: `${BASE_URL}/r/slug2`,
        originalUrl: 'https://example.com/2',
        clicks: 3,
        createdAt: new Date('2023-01-02'),
        expiresAt: new Date('2024-12-31'),
      });

      expect(mockLinkRepository.findAll).toHaveBeenCalledWith(10, 0);
    });

    it('should handle empty result', async () => {
      const request = { limit: 10, offset: 0 };
      mockLinkRepository.findAll.mockResolvedValue([]);

      const result = await listLinksUseCase.execute(request);

      expect(result.links).toHaveLength(0);
      expect(mockLinkRepository.findAll).toHaveBeenCalledWith(10, 0);
    });

    it('should throw error for invalid limit (too low)', async () => {
      const request = { limit: 0, offset: 0 };

      await expect(listLinksUseCase.execute(request)).rejects.toThrow(
        'Limit must be between 1 and 100',
      );

      expect(mockLinkRepository.findAll).not.toHaveBeenCalled();
    });

    it('should throw error for invalid limit (too high)', async () => {
      const request = { limit: 101, offset: 0 };

      await expect(listLinksUseCase.execute(request)).rejects.toThrow(
        'Limit must be between 1 and 100',
      );

      expect(mockLinkRepository.findAll).not.toHaveBeenCalled();
    });

    it('should throw error for negative offset', async () => {
      const request = { limit: 10, offset: -1 };

      await expect(listLinksUseCase.execute(request)).rejects.toThrow(
        'Offset must be non-negative',
      );

      expect(mockLinkRepository.findAll).not.toHaveBeenCalled();
    });

    it('should handle pagination correctly', async () => {
      const request = { limit: 5, offset: 10 };
      mockLinkRepository.findAll.mockResolvedValue([]);

      await listLinksUseCase.execute(request);

      expect(mockLinkRepository.findAll).toHaveBeenCalledWith(5, 10);
    });
  });
});
