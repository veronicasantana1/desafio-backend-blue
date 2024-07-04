import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  id_person: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  insurance: boolean;

  @Column()
  desc_insurance: string;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
}
