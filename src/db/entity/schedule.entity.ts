import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
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

    @Column()
    created_at: Date;
  
    @Column()
    updated_at: Date;
}