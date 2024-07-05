import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
export enum WeekDays{	
    Monday = "Monday",
    Tuesday = "Tuesday",
    Wednesday = "Wednesday",
    Thursday = "Thursday",
    Friday = "Friday",
    Saturday = "Saturday",
    Sunday = "Sunday"
}

@Entity()
export class Schedule {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "text", enum: WeekDays })
    week_days: WeekDays;

    @Column()
    start_time: string;

    @Column()
    end_time: string;

    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
}