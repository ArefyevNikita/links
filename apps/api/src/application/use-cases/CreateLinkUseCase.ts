import { Link } from '../../domain/entities/Link';
import { ILinkRepository } from '../../domain/repositories/ILinkRepository';
import { SlugService } from '../../domain/services/SlugService';
import { CreateLinkRequest } from '../dto/CreateLinkRequest';
import { CreateLinkResponse } from '../dto/CreateLinkResponse';
import { v4 as uuidv4 } from 'uuid';

export class CreateLinkUseCase {
  constructor(
    private readonly linkRepository: ILinkRepository,
    private readonly slugService: SlugService,
    private readonly baseUrl: string,
  ) {}

  public async execute(request: CreateLinkRequest): Promise<CreateLinkResponse> {
    this.validateRequest(request);

    const id = uuidv4();
    const slug = await this.slugService.generateUniqueSlug();
    
    const link = Link.create(
      id,
      slug.getValue(),
      request.originalUrl,
      request.expiresAt,
    );

    const savedLink = await this.linkRepository.save(link);

    return {
      id: savedLink.id,
      slug: savedLink.slug,
      shortUrl: `${this.baseUrl}/r/${savedLink.slug}`,
      originalUrl: savedLink.originalUrl,
      clicks: savedLink.clicks,
      createdAt: savedLink.createdAt,
      expiresAt: savedLink.expiresAt,
    };
  }
  
  private validateRequest(request: CreateLinkRequest): void {
    if (!this.isValidUrl(request.originalUrl)) {
      throw new Error('Invalid URL format');
    }

    if (request.expiresAt && request.expiresAt <= new Date()) {
      throw new Error('Expiration date must be in the future');
    }
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }
}
