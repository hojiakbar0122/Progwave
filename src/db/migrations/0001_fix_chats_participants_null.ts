import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixChatsParticipantsNull0001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Delete any join-table rows where either foreign key is NULL
    await queryRunner.query(`DELETE FROM "chats_participants_users" WHERE "chatsId" IS NULL OR "usersId" IS NULL;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // no-op (cannot restore deleted rows)
  }
}

export default FixChatsParticipantsNull0001;
