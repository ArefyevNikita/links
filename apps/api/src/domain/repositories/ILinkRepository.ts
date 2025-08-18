import { Link } from '../entities/Link';

export interface ILinkRepository {
  save(link: Link): Promise<Link>;
  findById(id: string): Promise<Link | null>;
  findBySlug(slug: string): Promise<Link | null>;
  findAll(limit: number, offset: number): Promise<Link[]>;
  delete(id: string): Promise<void>;
  isSlugUnique(slug: string): Promise<boolean>;
}
