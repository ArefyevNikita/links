import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class CreateLinksTable1703000000000 implements MigrationInterface {
  name = 'CreateLinksTable1703000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'links',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'slug',
            type: 'varchar',
            length: '10',
            isUnique: true,
          },
          {
            name: 'originalUrl',
            type: 'text',
          },
          {
            name: 'clicks',
            type: 'int',
            default: 0,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'expiresAt',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'links',
      new TableIndex({
        name: 'idx_links_slug',
        columnNames: ['slug'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('links', 'idx_links_slug');
    await queryRunner.dropTable('links');
  }
}
