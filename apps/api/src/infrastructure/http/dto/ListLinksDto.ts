import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class ListLinksDto {
  @ApiPropertyOptional({
    description: 'Number of links to return',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit must be an integer' })
  @Min(1, { message: 'limit must be at least 1' })
  @Max(100, { message: 'limit must be at most 100' })
  @Transform(({ value }) => value === undefined || value === '' ? 10 : parseInt(value as string) || 10)
  limit: number = 10;

  @ApiPropertyOptional({
    description: 'Number of links to skip',
    example: 0,
    minimum: 0,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'offset must be an integer' })
  @Min(0, { message: 'offset must be non-negative' })
  @Transform(({ value }) => value === undefined || value === '' ? 0 : parseInt(value as string) || 0)
  offset: number = 0;
}
