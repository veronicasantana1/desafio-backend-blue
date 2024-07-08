import { Request, Response } from "express";
import { DoctorRepository } from "../repositories/doctorRepository";
import { ClinicRepository } from "../repositories/clinicRepository";
import { AppointmentRepository } from "../repositories/appointmentRepository";
import { BadRequestError } from "../helpers/api-errors";
import { PersonRepository } from "../repositories/personRepository";
import { generatePDF } from "../helpers/pdf-generator";
import dayjs from "dayjs";

import { Between } from "typeorm";

export async function createAppointment(req: Request, res: Response) {
  const { date, id_clinic, id } = req.body;
  const user = req.user;
  if (!user) {
    throw new BadRequestError("User not authenticated");
  }

  const clinic = await ClinicRepository.findOneBy({ id: id_clinic });
  if (!clinic) {
    throw new BadRequestError("Clinic not found");
  }

  const doctor = await DoctorRepository.findOneBy({ id });
  if (!doctor) {
    throw new BadRequestError("Doctor not found");
  }

  const MoreThanDate = (date: Date) =>
    Between(new Date(date), dayjs(date).add(30, "minutes").toDate());
  const LessThanDate = (date: Date) =>
    Between(dayjs(date).subtract(30, "minutes").toDate(), new Date(date));

  const overlappingSchedule = await AppointmentRepository.find({
    where: [
      {
        date: MoreThanDate(new Date(date)),
        id_doctor: doctor.id,
      },
      {
        date: LessThanDate(new Date(date)),
        id_doctor: doctor.id,
      },
      {
        date: MoreThanDate(new Date(date)),
        id_user: user.id,
      },
      {
        date: LessThanDate(new Date(date)),
        id_user: user.id,
      },
    ],
  });

  if (overlappingSchedule.length > 0) {
    throw new BadRequestError(
      "There is already a appointment for this time interval and doctor"
    );
  }

  const newAppointment = AppointmentRepository.create({
    id_user: user.id,
    id_doctor: doctor.id,
    date: date,
    id_clinic: clinic.id,
  });

  await AppointmentRepository.save(newAppointment);
  
  
  await generatePDF(newAppointment);
  return res.status(201).json(newAppointment);
}

export async function updateAppointment(req: Request, res: Response) {
  const { id, date, id_clinic, id_doctor } = req.body;
  const user = req.user;
  if (!user) {
    throw new BadRequestError("User not authenticated");
  }

  const existingAppointment = await AppointmentRepository.findOneBy({ id });
  if (!existingAppointment) {
    throw new BadRequestError("Appointment not found");
  }

  const clinic = await ClinicRepository.findOneBy({ id: id_clinic });
  if (!clinic) {
    throw new BadRequestError("Clinic not found");
  }

  const doctor = await DoctorRepository.findOneBy({
    id: id_doctor,
  });
  if (!doctor) {
    throw new BadRequestError("Doctor not found for this specialty");
  }

  const MoreThanDate = (date: Date) =>
    Between(new Date(date), dayjs(date).add(30, "minutes").toDate());
  const LessThanDate = (date: Date) =>
    Between(dayjs(date).subtract(30, "minutes").toDate(), new Date(date));

  const overlappingSchedule = await AppointmentRepository.find({
    where: [
      {
        date: MoreThanDate(new Date(date)),
        id_doctor: doctor.id,
      },
      {
        date: LessThanDate(new Date(date)),
        id_doctor: doctor.id,
      },
      {
        date: MoreThanDate(new Date(date)),
        id_user: user.id,
      },
      {
        date: LessThanDate(new Date(date)),
        id_user: user.id,
      },
    ],
  });

  if (
    overlappingSchedule.length > 0 &&
    overlappingSchedule[0].id !== existingAppointment.id
  ) {
    throw new BadRequestError(
      "There is already a appointment for this time interval and doctor"
    );
  }

  await AppointmentRepository.update(
    { id },
    {
      id_doctor: doctor.id,
      id_clinic: clinic.id,
      date,
    }
  );

  const updatedAppointment = await AppointmentRepository.findOneBy({ id });
  return res.status(200).json(updatedAppointment);
}

export async function deleteAppointment(req: Request, res: Response) {
  const { id } = req.body;
  const user = req.user;
  if (!user) {
    throw new BadRequestError("User not authenticated");
  }
  const appointment = await AppointmentRepository.findOneBy({ id });
  if (!appointment) {
    throw new BadRequestError("Appointment not found");
  }
  await AppointmentRepository.delete(id);
  return res.status(200).json({ message: "Appointment deleted" });
}

export async function getAppointments(req: Request, res: Response) {
  const user = req.user;
  if (!user) {
    throw new BadRequestError("User not authenticated");
  }
  const appointments = await AppointmentRepository.find({
    where: { id_user: user.id },
  });
  if (!appointments) {
    throw new BadRequestError("No appointments found");
  }

  const appointmentsData = await Promise.all(
    appointments.map(async (appointment) => {
      const doctor = await DoctorRepository.findOneBy({
        id: appointment.id_doctor,
      });
      if (!doctor) {
        throw new BadRequestError("Doctor not found");
      }
      const doctorName = await PersonRepository.findOneBy({
        id: doctor.id_person,
      });
      if (!doctorName) {
        throw new BadRequestError("Doctor not found");
      }
      const clinic = await ClinicRepository.findOneBy({
        id: appointment.id_clinic,
      });
      if (!clinic) {
        throw new BadRequestError("Clinic not found");
      }

      return {
        id: appointment.id,
        date: appointment.date,
        doctor: {
          id: doctor.id,
          name: doctorName.name,
          specialty: doctor.specialty,
        },
        clinic: clinic.name,
      };
    })
  );

  return res.status(200).json(appointmentsData);
}
