import { ILinkRepository } from '../../domain/repositories/ILinkRepository';

export class DeleteLinkUseCase {
  constructor(private readonly linkRepository: ILinkRepository) {}

  public async execute(id: string): Promise<void> {
    const link = await this.linkRepository.findById(id);

    if (!link) {
      throw new Error('Link not found');
    }

    await this.linkRepository.delete(id);
  }
}
