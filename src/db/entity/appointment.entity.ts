import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  id_user: number;

  @Column()
  id_doctor: number;

  @Column()
  date: Date;

  @Column()
  id_clinic: number;

  @Column()
  created_at: Date;

  @Column()
  updated_at: Date;
}
