import { ILinkRepository } from '../../domain/repositories/ILinkRepository';

export class ResolveSlugUseCase {
  constructor(private readonly linkRepository: ILinkRepository) {}

  public async execute(slug: string): Promise<string> {
    const link = await this.linkRepository.findBySlug(slug);

    if (!link) {
      throw new Error('Link not found');
    }

    if (link.isExpired()) {
      throw new Error('Link has expired');
    }

    const updatedLink = link.incrementClicks();
    await this.linkRepository.save(updatedLink);

    return link.originalUrl;
  }
}
