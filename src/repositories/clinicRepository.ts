import { AppDataSource } from "../data-source";
import { Clinic } from "../db/entity/clinic.entity";

export const ClinicRepository = AppDataSource.getRepository(Clinic)