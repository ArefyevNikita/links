import { ApiProperty } from '@nestjs/swagger';
import { LinkResponseDto } from './LinkResponseDto';

export class ListLinksResponseDto {
  @ApiProperty({
    description: 'Array of links',
    type: [LinkResponseDto],
  })
  links!: LinkResponseDto[];
}
