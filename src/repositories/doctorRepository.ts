import { AppDataSource } from "../data-source";
import { Doctor } from "../db/entity/doctor.entity";

export const DoctorRepository = AppDataSource.getRepository(Doctor)