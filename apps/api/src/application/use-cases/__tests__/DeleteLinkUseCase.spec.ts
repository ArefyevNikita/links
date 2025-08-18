import { DeleteLinkUseCase } from '../DeleteLinkUseCase';
import { ILinkRepository } from '../../../domain/repositories/ILinkRepository';
import { Link } from '../../../domain/entities/Link';

describe('DeleteLinkUseCase', () => {
  let deleteLinkUseCase: DeleteLinkUseCase;
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

    deleteLinkUseCase = new DeleteLinkUseCase(mockLinkRepository);
  });

  describe('execute', () => {
    it('should delete link successfully', async () => {
      const linkId = 'test-id';
      const mockLink = new Link(
        linkId,
        'test123',
        'https://example.com/test',
        new Date(),
        null,
        5,
      );

      mockLinkRepository.findById.mockResolvedValue(mockLink);
      mockLinkRepository.delete.mockResolvedValue();

      await deleteLinkUseCase.execute(linkId);

      expect(mockLinkRepository.findById).toHaveBeenCalledWith(linkId);
      expect(mockLinkRepository.delete).toHaveBeenCalledWith(linkId);
    });

    it('should throw error when link not found', async () => {
      const linkId = 'nonexistent-id';
      mockLinkRepository.findById.mockResolvedValue(null);

      await expect(deleteLinkUseCase.execute(linkId)).rejects.toThrow(
        'Link not found',
      );

      expect(mockLinkRepository.findById).toHaveBeenCalledWith(linkId);
      expect(mockLinkRepository.delete).not.toHaveBeenCalled();
    });

    it('should handle repository errors gracefully', async () => {
      const linkId = 'test-id';
      const mockLink = new Link(
        linkId,
        'test123',
        'https://example.com/test',
        new Date(),
        null,
        5,
      );

      mockLinkRepository.findById.mockResolvedValue(mockLink);
      mockLinkRepository.delete.mockRejectedValue(new Error('Database error'));

      await expect(deleteLinkUseCase.execute(linkId)).rejects.toThrow(
        'Database error',
      );

      expect(mockLinkRepository.findById).toHaveBeenCalledWith(linkId);
      expect(mockLinkRepository.delete).toHaveBeenCalledWith(linkId);
    });
  });
});
