import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Link } from '../../../domain/entities/Link';
import { ILinkRepository } from '../../../domain/repositories/ILinkRepository';
import { LinkOrmEntity } from './entities/LinkOrmEntity';

@Injectable()
export class LinkRepository implements ILinkRepository {
  constructor(
    @InjectRepository(LinkOrmEntity)
    private readonly ormRepository: Repository<LinkOrmEntity>,
  ) {}

  public async save(link: Link): Promise<Link> {
    const ormEntity = this.toOrmEntity(link);
    const savedEntity = await this.ormRepository.save(ormEntity);
    return this.toDomainEntity(savedEntity);
  }

  public async findById(id: string): Promise<Link | null> {
    const entity = await this.ormRepository.findOne({ where: { id } });
    return entity ? this.toDomainEntity(entity) : null;
  }

  public async findBySlug(slug: string): Promise<Link | null> {
    const entity = await this.ormRepository.findOne({ where: { slug } });
    return entity ? this.toDomainEntity(entity) : null;
  }

  public async findAll(limit: number, offset: number): Promise<Link[]> {
    const entities = await this.ormRepository.find({
      take: limit,
      skip: offset,
      order: { createdAt: 'DESC' },
    });
    return entities.map(entity => this.toDomainEntity(entity));
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async isSlugUnique(slug: string): Promise<boolean> {
    const count = await this.ormRepository.count({ where: { slug } });
    return count === 0;
  }

  private toOrmEntity(link: Link): LinkOrmEntity {
    const entity = new LinkOrmEntity();
    entity.id = link.id;
    entity.slug = link.slug;
    entity.originalUrl = link.originalUrl;
    entity.clicks = link.clicks;
    entity.createdAt = link.createdAt;
    entity.expiresAt = link.expiresAt;
    return entity;
  }

  private toDomainEntity(entity: LinkOrmEntity): Link {
    return new Link(
      entity.id,
      entity.slug,
      entity.originalUrl,
      entity.createdAt,
      entity.expiresAt,
      entity.clicks,
    );
  }
}
