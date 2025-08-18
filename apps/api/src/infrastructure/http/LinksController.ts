import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  Query,
  Res,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { Response } from 'express';
import { CreateLinkUseCase } from '../../application/use-cases/CreateLinkUseCase';
import { ResolveSlugUseCase } from '../../application/use-cases/ResolveSlugUseCase';
import { ListLinksUseCase } from '../../application/use-cases/ListLinksUseCase';
import { DeleteLinkUseCase } from '../../application/use-cases/DeleteLinkUseCase';
import { CreateLinkDto } from './dto/CreateLinkDto';
import { ListLinksDto } from './dto/ListLinksDto';
import { LinkResponseDto } from './dto/LinkResponseDto';
import { ListLinksResponseDto } from './dto/ListLinksResponseDto';

@ApiTags('links')
@Controller()
export class LinksController {
  constructor(
    private readonly createLinkUseCase: CreateLinkUseCase,
    private readonly resolveSlugUseCase: ResolveSlugUseCase,
    private readonly listLinksUseCase: ListLinksUseCase,
    private readonly deleteLinkUseCase: DeleteLinkUseCase,
  ) {}

  @Post('links')
  @ApiOperation({ summary: 'Create a new short link' })
  @ApiResponse({
    status: 201,
    description: 'Link created successfully',
    type: LinkResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  public async createLink(@Body() createLinkDto: CreateLinkDto): Promise<LinkResponseDto> {
    try {
      const result = await this.createLinkUseCase.execute({
        originalUrl: createLinkDto.originalUrl,
        expiresAt: createLinkDto.expiresAt,
      });

      return result;
    } catch (error) {
      throw new HttpException(
        error instanceof Error ? error.message : 'Failed to create link',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('r/:slug')
  @ApiOperation({ summary: 'Redirect to original URL by slug' })
  @ApiParam({
    name: 'slug',
    description: 'Short link slug',
    example: 'abc123x',
  })
  @ApiResponse({
    status: 302,
    description: 'Redirect to original URL',
  })
  @ApiResponse({
    status: 404,
    description: 'Link not found or expired',
  })
  public async redirectToOriginal(
    @Param('slug') slug: string,
    @Res() res: Response,
  ): Promise<void> {
    try {
      const originalUrl = await this.resolveSlugUseCase.execute(slug);
      res.redirect(302, originalUrl);
    } catch (error) {
      throw new HttpException(
        error instanceof Error ? error.message : 'Link not found',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get('links')
  @ApiOperation({ summary: 'List all links with pagination' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of links to return (1-100)',
    example: 10,
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    description: 'Number of links to skip',
    example: 0,
  })
  @ApiResponse({
    status: 200,
    description: 'List of links',
    type: ListLinksResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid pagination parameters',
  })
  public async listLinks(@Query() query: ListLinksDto): Promise<ListLinksResponseDto> {
    try {
      const result = await this.listLinksUseCase.execute({
        limit: query.limit,
        offset: query.offset,
      });

      return result;
    } catch (error) {
      throw new HttpException(
        error instanceof Error ? error.message : 'Failed to list links',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete('links/:id')
  @ApiOperation({ summary: 'Delete a link by ID' })
  @ApiParam({
    name: 'id',
    description: 'Link UUID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: 204,
    description: 'Link deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Link not found',
  })
  public async deleteLink(@Param('id') id: string): Promise<void> {
    try {
      await this.deleteLinkUseCase.execute(id);
    } catch (error) {
      throw new HttpException(
        error instanceof Error ? error.message : 'Failed to delete link',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
