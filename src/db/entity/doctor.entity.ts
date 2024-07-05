import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn } from "typeorm";
export enum Specialty {
  Cardiologia = "Cardiologia",
  Dermatologia = "Dermatologia",
  Endocrinologia = "Endocrinologia",
  Gastroenterologia = "Gastroenterologia",
  Hematologia = "Hematologia",
  Imunologia = "Imunologia",
  DoencaInfecciosa = "Doença Infecciosa",
  Nefrologia = "Nefrologia",
  Neurologia = "Neurologia",
  ObstetriciaGinecologia = "Obstetrícia e Ginecologia",
  Oncologia = "Oncologia",
  Oftalmologia = "Oftalmologia",
  Ortopedia = "Ortopedia",
  Otorrinolaringologia = "Otorrinolaringologia",
  Pediatria = "Pediatria",
  Psiquiatria = "Psiquiatria",
  Pneumologia = "Pneumologia",
  Radiologia = "Radiologia",
  Reumatologia = "Reumatologia",
  Cirurgia = "Cirurgia",
  Urologia = "Urologia",
}
@Entity()
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  id_person: string;

  @Column()
  id_clinic: string;

  @Column({ type: "text", enum: Specialty })
  specialty: Specialty;

  @Column()
  crm: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
