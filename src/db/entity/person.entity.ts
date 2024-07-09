import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn } from "typeorm";

@Entity()
export class Person {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    cpf: string;

    @Column()
    phone: number;

    @Column()
    email: string;

    @Column({ nullable: true })
    birth_date: Date;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    gender: string;

    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
    
}
