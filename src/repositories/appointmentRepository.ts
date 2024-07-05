import { AppDataSource } from "../data-source";
import { Appointment } from "../db/entity/appointment.entity";

export const AppointmentRepository = AppDataSource.getRepository(Appointment)