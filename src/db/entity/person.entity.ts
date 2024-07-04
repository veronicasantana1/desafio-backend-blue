import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Person {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    cpf: string;

    @Column()
    phone: string;

    @Column()
    email: string;

    @Column()
    birth_date: Date;

    @Column()
    address: string;

    @Column()
    gender: string;

    @Column()
    created_at: Date;
  
    @Column()
    updated_at: Date;
    
}
