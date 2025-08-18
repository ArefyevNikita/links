import { nanoid } from 'nanoid';
import { Slug } from '../value-objects/Slug';
import { ILinkRepository } from '../repositories/ILinkRepository';

export class SlugService {
  constructor(private readonly linkRepository: ILinkRepository) {}

  public async generateUniqueSlug(): Promise<Slug> {
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const slugValue = nanoid(7);
      const slug = new Slug(slugValue);

      const isUnique = await this.linkRepository.isSlugUnique(slugValue);
      if (isUnique) {
        return slug;
      }

      attempts++;
    }

    const longerSlugValue = nanoid(10);
    return new Slug(longerSlugValue);
  }
}
