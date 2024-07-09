import { Request, Response } from "express";
import { DoctorRepository } from "../repositories/doctorRepository";
import { ClinicRepository } from "../repositories/clinicRepository";
import { AppointmentRepository } from "../repositories/appointmentRepository";
import { BadRequestError } from "../helpers/api-errors";
import { PersonRepository } from "../repositories/personRepository";
import { generatePDF } from "../helpers/pdf-generator";
import dayjs from "dayjs";
import { Between } from "typeorm";
import { sendAppointmentEmail } from "../mail/send-pdf";

export async function createAppointment(req: Request, res: Response) {
  const { date, id_clinic, id_doctor } = req.body;
  const user = req.user;
  if (!user) {
    throw new BadRequestError("User not Usuário não autenticado");
  }

  const clinic = await ClinicRepository.findOneBy({ id: id_clinic });
  if (!clinic) {
    throw new BadRequestError("Clínica não encontrada");
  }

  const doctor = await DoctorRepository.findOneBy({ id: id_doctor});
  if (!doctor) {
    throw new BadRequestError("Médico não encontrado");
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
      "Já existe um agendamento para este intervalo de tempo e médico"
    );
  }

  const newAppointment = AppointmentRepository.create({
    id_user: user.id,
    id_doctor: doctor.id,
    date: date,
    id_clinic: clinic.id,
    created_at: dayjs().utc().toDate(),
    updated_at: dayjs().utc().toDate(), 
  });

  await AppointmentRepository.save(newAppointment);
  
  const doctorName = await PersonRepository.findOneBy({ id: doctor.id_person });
  if (!doctorName) {
    throw new BadRequestError("Médico não encontrado");
  }

  const clinicName = await ClinicRepository.findOneBy({ id: clinic.id });
  if (!clinicName) {
    throw new BadRequestError("Clínica não encontrada");
  }

  const userData = await PersonRepository.findOneBy({ id: user.id_person });
  if (!userData) {
    throw new BadRequestError("Usuário não encontrado");
  }
  const appointmentsData = {
    date: newAppointment.date,
    user: {
      name: userData.name,
      cpf: userData.cpf,
      phone: userData.phone,
      email: userData.email,
    },
    doctor: {
      crm : doctor.crm,
      name: doctorName.name,
      specialty: doctor.specialty,
    },
    clinic: {name: clinicName.name, address: clinicName.address, phone: clinicName.phone},
  };
  try {
    console.log(userData.email)
    await sendAppointmentEmail(appointmentsData, userData.email);
    return res.status(201).json(newAppointment);
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    return res.status(500).json({ error: 'Erro ao enviar e-mail' });
  }
}

export async function updateAppointment(req: Request, res: Response) {
  const { id, date, id_clinic, id_doctor } = req.body;
  const user = req.user;
  if (!user) {
    throw new BadRequestError("Usuário não autenticado");
  }

  const existingAppointment = await AppointmentRepository.findOneBy({ id });
  if (!existingAppointment) {
    throw new BadRequestError("Agendamento não encontrado");
  }

  const clinic = await ClinicRepository.findOneBy({ id: id_clinic });
  if (!clinic) {
    throw new BadRequestError("Clínica não encontrada");
  }

  const doctor = await DoctorRepository.findOneBy({
    id: id_doctor,
  });
  if (!doctor) {
    throw new BadRequestError("Médico não encontrado");
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
      "Já existe um agendamento para este intervalo de tempo e médico"
    );
  }

  await AppointmentRepository.update(
    { id },
    {
      id_doctor: doctor.id,
      id_clinic: clinic.id,
      date,
      created_at: dayjs().utc().toDate(),
      updated_at: dayjs().utc().toDate(), 
    }
  );

  const updatedAppointment = await AppointmentRepository.findOneBy({ id });
  if (!updatedAppointment) {
    throw new BadRequestError("Agendamento não encontrado");
  }

  const doctorName = await PersonRepository.findOneBy({ id: doctor.id_person });
  if (!doctorName) {
    throw new BadRequestError("Médico não encontrado");
  }

  const clinicName = await ClinicRepository.findOneBy({ id: clinic.id });
  if (!clinicName) {
    throw new BadRequestError("Clínica não encontrada");
  }

  const userData = await PersonRepository.findOneBy({ id: user.id });
  if (!userData) {
    throw new BadRequestError("Usuário não encontrado");
  }
  const appointmentsData = {
    date: updatedAppointment.date,
    user: {
      name: userData.name,
      cpf: userData.cpf,
      phone: userData.phone,
      email: userData.email,
    },
    doctor: {
      crm : doctor.crm,
      name: doctorName.name,
      specialty: doctor.specialty,
    },
    clinic: {name: clinicName.name, address: clinicName.address, phone: clinicName.phone},
  };

  await generatePDF(appointmentsData);
  return res.status(200).json(updatedAppointment);
}

export async function deleteAppointment(req: Request, res: Response) {
  const { id } = req.body;
  const user = req.user;
  if (!user) {
    throw new BadRequestError("Usuário não autenticado");
  }
  const appointment = await AppointmentRepository.findOneBy({ id });
  if (!appointment) {
    throw new BadRequestError("Consulta não encontrada");
  }
  await AppointmentRepository.delete(id);
  return res.status(200).json({ message: "Consulta Cancelada" });
}

export async function getAppointments(req: Request, res: Response) {
  const user = req.user;
  if (!user) {
    throw new BadRequestError("Usuário não autenticado");
  }
  const appointments = await AppointmentRepository.find({
    where: { id_user: user.id },
  });
  if (!appointments) {
    throw new BadRequestError("Consultas não encontradas");
  }

  const appointmentsData = await Promise.all(
    appointments.map(async (appointment) => {
      const doctor = await DoctorRepository.findOneBy({
        id: appointment.id_doctor,
      });
      if (!doctor) {
        throw new BadRequestError("Médico não encontrado");
      }
      const doctorName = await PersonRepository.findOneBy({
        id: doctor.id_person,
      });
      if (!doctorName) {
        throw new BadRequestError("Médico não encontrado");
      }
      const clinic = await ClinicRepository.findOneBy({
        id: appointment.id_clinic,
      });
      if (!clinic) {
        throw new BadRequestError("Clínica não encontrada");
      }

      return {
        id: appointment.id,
        date: appointment.date,
        doctor: {
          id: doctor.id,
          name: doctorName.name,
          specialty: doctor.specialty,
        },
        clinic: {
          id: clinic.id,
          name: clinic.name,
          address: clinic.address,
          phone: clinic.phone,
        },
      };
    })
  );

  return res.status(200).json(appointmentsData);
}
