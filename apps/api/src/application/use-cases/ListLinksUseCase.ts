import { ILinkRepository } from '../../domain/repositories/ILinkRepository';
import { ListLinksRequest } from '../dto/ListLinksRequest';
import { ListLinksResponse } from '../dto/ListLinksResponse';

export class ListLinksUseCase {
  constructor(
    private readonly linkRepository: ILinkRepository,
    private readonly baseUrl: string,
  ) {}

  public async execute(request: ListLinksRequest): Promise<ListLinksResponse> {
    this.validateRequest(request);

    const links = await this.linkRepository.findAll(request.limit, request.offset);

    return {
      links: links.map(link => ({
        id: link.id,
        slug: link.slug,
        shortUrl: `${this.baseUrl}/r/${link.slug}`,
        originalUrl: link.originalUrl,
        clicks: link.clicks,
        createdAt: link.createdAt,
        expiresAt: link.expiresAt,
      })),
    };
  }

  private validateRequest(request: ListLinksRequest): void {
    if (request.limit <= 0 || request.limit > 100) {
      throw new Error('Limit must be between 1 and 100');
    }

    if (request.offset < 0) {
      throw new Error('Offset must be non-negative');
    }
  }
}
