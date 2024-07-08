import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1720440254011 implements MigrationInterface {
    name = 'Default1720440254011'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "id_person" integer NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "insurance" boolean, "desc_insurance" varchar, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "person" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "cpf" varchar NOT NULL, "phone" varchar NOT NULL, "email" varchar NOT NULL, "birth_date" datetime, "address" varchar, "gender" varchar, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "doctor" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "id_person" integer NOT NULL, "id_clinic" integer NOT NULL, "specialty" varchar CHECK( "specialty" IN ('Cardiologia','Dermatologia','Endocrinologia','Gastroenterologia','Hematologia','Imunologia','Nefrologia','Neurologia','Obstetrícia e Ginecologia','Oncologia','Oftalmologia','Ortopedia','Otorrinolaringologia','Pediatria','Psiquiatria','Pneumologia','Radiologia','Reumatologia','Cirurgia','Urologia') ) NOT NULL, "crm" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "appointment" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "id_user" integer NOT NULL, "id_doctor" integer NOT NULL, "date" datetime NOT NULL, "id_clinic" integer NOT NULL, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "clinic" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "address" varchar NOT NULL, "phone" integer NOT NULL, "cnpj" varchar NOT NULL, "cep" varchar, "created_at" datetime NOT NULL DEFAULT (datetime('now')), "updated_at" datetime NOT NULL DEFAULT (datetime('now')))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "clinic"`);
        await queryRunner.query(`DROP TABLE "appointment"`);
        await queryRunner.query(`DROP TABLE "doctor"`);
        await queryRunner.query(`DROP TABLE "person"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
