import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUrl, IsOptional, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateLinkDto {
  @ApiProperty({
    description: 'Original URL to shorten',
    example: 'https://example.com/very/long/path',
  })
  @IsUrl({}, { message: 'originalUrl must be a valid URL' })
  originalUrl!: string;

  @ApiPropertyOptional({
    description: 'Expiration date for the link (ISO string)',
    example: '2024-12-31T23:59:59.000Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'expiresAt must be a valid ISO date string' })
  @Transform(({ value }) => (value as string) ? new Date(value as string) : undefined)
  expiresAt?: Date;
}
