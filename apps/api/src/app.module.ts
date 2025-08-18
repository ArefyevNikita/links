import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './infrastructure/persistence/typeorm/data-source';
import { LinkOrmEntity } from './infrastructure/persistence/typeorm/entities/LinkOrmEntity';
import { LinkRepository } from './infrastructure/persistence/typeorm/LinkRepository';
import { SlugService } from './domain/services/SlugService';
import { CreateLinkUseCase } from './application/use-cases/CreateLinkUseCase';
import { ResolveSlugUseCase } from './application/use-cases/ResolveSlugUseCase';
import { ListLinksUseCase } from './application/use-cases/ListLinksUseCase';
import { DeleteLinkUseCase } from './application/use-cases/DeleteLinkUseCase';
import { LinksController } from './infrastructure/http/LinksController';
import { ILinkRepository } from './domain/repositories/ILinkRepository';
import { LINK_REPOSITORY_TOKEN } from './domain/repositories/ILinkRepository.token';
import { validateEnv } from './infrastructure/config/env';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...AppDataSource.options,
    }),
    TypeOrmModule.forFeature([LinkOrmEntity]),
  ],
  controllers: [LinksController],
  providers: [
    {
      provide: LINK_REPOSITORY_TOKEN,
      useClass: LinkRepository,
    },
    {
      provide: SlugService,
      useFactory: (linkRepository: ILinkRepository): SlugService => {
        return new SlugService(linkRepository);
      },
      inject: [LINK_REPOSITORY_TOKEN],
    },
    {
      provide: CreateLinkUseCase,
      useFactory: (linkRepository: ILinkRepository, slugService: SlugService): CreateLinkUseCase => {
        const env = validateEnv();
        return new CreateLinkUseCase(linkRepository, slugService, env.BASE_URL);
      },
      inject: [LINK_REPOSITORY_TOKEN, SlugService],
    },
    {
      provide: ResolveSlugUseCase,
      useFactory: (linkRepository: ILinkRepository): ResolveSlugUseCase => {
        return new ResolveSlugUseCase(linkRepository);
      },
      inject: [LINK_REPOSITORY_TOKEN],
    },
    {
      provide: ListLinksUseCase,
      useFactory: (linkRepository: ILinkRepository): ListLinksUseCase => {
        const env = validateEnv();
        return new ListLinksUseCase(linkRepository, env.BASE_URL);
      },
      inject: [LINK_REPOSITORY_TOKEN],
    },
    {
      provide: DeleteLinkUseCase,
      useFactory: (linkRepository: ILinkRepository): DeleteLinkUseCase => {
        return new DeleteLinkUseCase(linkRepository);
      },
      inject: [LINK_REPOSITORY_TOKEN],
    },
  ],
})
export class AppModule implements OnModuleInit {
  async onModuleInit(): Promise<void> {
    try {
      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
      }
      await AppDataSource.runMigrations();
      console.log('Database migrations completed successfully');
    } catch (error) {
      console.error('Failed to run database migrations:', error);
      process.exit(1);
    }
  }
}
