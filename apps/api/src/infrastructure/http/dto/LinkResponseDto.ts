import { ApiProperty } from '@nestjs/swagger';

export class LinkResponseDto {
  @ApiProperty({
    description: 'Unique identifier for the link',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id!: string;

  @ApiProperty({
    description: 'Short slug for the link',
    example: 'abc123x',
  })
  slug!: string;

  @ApiProperty({
    description: 'Complete short URL',
    example: 'http://localhost:3001/r/abc123x',
  })
  shortUrl!: string;

  @ApiProperty({
    description: 'Original URL',
    example: 'https://example.com/very/long/path',
  })
  originalUrl!: string;

  @ApiProperty({
    description: 'Number of times the link has been clicked',
    example: 42,
  })
  clicks!: number;

  @ApiProperty({
    description: 'When the link was created',
    example: '2023-12-19T10:30:00.000Z',
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'When the link expires (if applicable)',
    example: '2024-12-31T23:59:59.000Z',
    nullable: true,
  })
  expiresAt!: Date | null;
}
