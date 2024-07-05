import { AppDataSource } from "../data-source";
import { Schedule } from "../db/entity/schedule.entity";

export const ScheduleRepository = AppDataSource.getRepository(Schedule)