import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  id_person: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  insurance: boolean;

  @Column({ nullable: true })
  desc_insurance: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
