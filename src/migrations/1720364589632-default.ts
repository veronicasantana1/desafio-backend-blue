import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1720364589632 implements MigrationInterface {
    name = 'Default1720364589632'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_schedule" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "week_days" varchar CHECK( "week_days" IN ('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') ) NOT NULL, "start_time" varchar NOT NULL, "end_time" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "temporary_schedule"("id", "week_days", "start_time", "end_time", "created_at", "updated_at") SELECT "id", "week_days", "start_time", "end_time", "created_at", "updated_at" FROM "schedule"`);
        await queryRunner.query(`DROP TABLE "schedule"`);
        await queryRunner.query(`ALTER TABLE "temporary_schedule" RENAME TO "schedule"`);
        await queryRunner.query(`CREATE TABLE "temporary_appointment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "id_user" integer NOT NULL, "id_doctor" integer NOT NULL, "id_schedule" datetime NOT NULL, "id_clinic" integer NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "temporary_appointment"("id", "id_user", "id_doctor", "id_schedule", "id_clinic", "created_at", "updated_at") SELECT "id", "id_user", "id_doctor", "date", "id_clinic", "created_at", "updated_at" FROM "appointment"`);
        await queryRunner.query(`DROP TABLE "appointment"`);
        await queryRunner.query(`ALTER TABLE "temporary_appointment" RENAME TO "appointment"`);
        await queryRunner.query(`CREATE TABLE "temporary_schedule" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "week_days" varchar CHECK( "week_days" IN ('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') ) NOT NULL, "start_time" varchar NOT NULL, "end_time" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "temporary_schedule"("id", "week_days", "start_time", "end_time", "created_at", "updated_at") SELECT "id", "week_days", "start_time", "end_time", "created_at", "updated_at" FROM "schedule"`);
        await queryRunner.query(`DROP TABLE "schedule"`);
        await queryRunner.query(`ALTER TABLE "temporary_schedule" RENAME TO "schedule"`);
        await queryRunner.query(`CREATE TABLE "temporary_doctor" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "id_person" integer NOT NULL, "id_clinic" integer NOT NULL, "specialty" varchar CHECK( "specialty" IN ('Cardiologia','Dermatologia','Endocrinologia','Gastroenterologia','Hematologia','Imunologia','Doença Infecciosa','Nefrologia','Neurologia','Obstetrícia e Ginecologia','Oncologia','Oftalmologia','Ortopedia','Otorrinolaringologia','Pediatria','Psiquiatria','Pneumologia','Radiologia','Reumatologia','Cirurgia','Urologia') ) NOT NULL, "crm" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "temporary_doctor"("id", "id_person", "id_clinic", "specialty", "crm", "created_at", "updated_at") SELECT "id", "id_person", "id_clinic", "specialty", "crm", "created_at", "updated_at" FROM "doctor"`);
        await queryRunner.query(`DROP TABLE "doctor"`);
        await queryRunner.query(`ALTER TABLE "temporary_doctor" RENAME TO "doctor"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doctor" RENAME TO "temporary_doctor"`);
        await queryRunner.query(`CREATE TABLE "doctor" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "id_person" integer NOT NULL, "id_clinic" varchar NOT NULL, "specialty" varchar CHECK( "specialty" IN ('Cardiologia','Dermatologia','Endocrinologia','Gastroenterologia','Hematologia','Imunologia','Doença Infecciosa','Nefrologia','Neurologia','Obstetrícia e Ginecologia','Oncologia','Oftalmologia','Ortopedia','Otorrinolaringologia','Pediatria','Psiquiatria','Pneumologia','Radiologia','Reumatologia','Cirurgia','Urologia') ) NOT NULL, "crm" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "doctor"("id", "id_person", "id_clinic", "specialty", "crm", "created_at", "updated_at") SELECT "id", "id_person", "id_clinic", "specialty", "crm", "created_at", "updated_at" FROM "temporary_doctor"`);
        await queryRunner.query(`DROP TABLE "temporary_doctor"`);
        await queryRunner.query(`ALTER TABLE "schedule" RENAME TO "temporary_schedule"`);
        await queryRunner.query(`CREATE TABLE "schedule" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "week_days" varchar CHECK( "week_days" IN ('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') ) NOT NULL, "start_time" varchar NOT NULL, "end_time" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "schedule"("id", "week_days", "start_time", "end_time", "created_at", "updated_at") SELECT "id", "week_days", "start_time", "end_time", "created_at", "updated_at" FROM "temporary_schedule"`);
        await queryRunner.query(`DROP TABLE "temporary_schedule"`);
        await queryRunner.query(`ALTER TABLE "appointment" RENAME TO "temporary_appointment"`);
        await queryRunner.query(`CREATE TABLE "appointment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "id_user" integer NOT NULL, "id_doctor" integer NOT NULL, "date" datetime NOT NULL, "id_clinic" integer NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "appointment"("id", "id_user", "id_doctor", "date", "id_clinic", "created_at", "updated_at") SELECT "id", "id_user", "id_doctor", "id_schedule", "id_clinic", "created_at", "updated_at" FROM "temporary_appointment"`);
        await queryRunner.query(`DROP TABLE "temporary_appointment"`);
        await queryRunner.query(`ALTER TABLE "schedule" RENAME TO "temporary_schedule"`);
        await queryRunner.query(`CREATE TABLE "schedule" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "week_days" varchar CHECK( "week_days" IN ('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') ) NOT NULL, "start_time" varchar NOT NULL, "end_time" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "schedule"("id", "week_days", "start_time", "end_time", "created_at", "updated_at") SELECT "id", "week_days", "start_time", "end_time", "created_at", "updated_at" FROM "temporary_schedule"`);
        await queryRunner.query(`DROP TABLE "temporary_schedule"`);
    }

}
