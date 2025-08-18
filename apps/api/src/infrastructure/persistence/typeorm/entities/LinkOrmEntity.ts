import { Entity, PrimaryColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('links')
export class LinkOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 10, unique: true })
  @Index('idx_links_slug', { unique: true })
  slug!: string;

  @Column({ type: 'text' })
  originalUrl!: string;

  @Column({ type: 'int', default: 0 })
  clicks!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt!: Date | null;
}
