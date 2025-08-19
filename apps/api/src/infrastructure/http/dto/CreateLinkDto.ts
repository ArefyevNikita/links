import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUrl, IsOptional, ValidateIf } from 'class-validator';
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
  @Transform(({ value }) => {
    if (!value) return undefined;
    
    if (value instanceof Date) return value;
    
    if (typeof value === 'string') {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        throw new Error('expiresAt must be a valid ISO date string');
      }
      return date;
    }
    
    throw new Error('expiresAt must be a valid ISO date string');
  })
  @ValidateIf((obj) => obj.expiresAt !== undefined)
  expiresAt?: Date;
}
