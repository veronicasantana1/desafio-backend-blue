import { Request, Response } from 'express';
import { UserRepository } from '../repositories/userRepository';
import { DoctorRepository } from '../repositories/doctorRepository';
import { ClinicRepository } from '../repositories/clinicRepository';
import { AppointmentRepository } from '../repositories/appointmentRepository';
import { BadRequestError } from '../helpers/api-errors';
import { ScheduleRepository } from '../repositories/scheduleRepository';
import { PersonRepository } from '../repositories/personRepository';

export async function createAppointment(req: Request, res: Response) {
    const {  date, start_time, end_time, clinic_name, specialty, doctor_name } = req.body;
    const user = req.user;
    if (!user) {
        throw new BadRequestError('User not authenticated');
      }      

    // const clinic = await ClinicRepository.findOneBy({ name: clinic_name });
    // if (!clinic) {
    //   throw new BadRequestError("Clinic not found");
    // }

    // const doctorName = await PersonRepository.findOneBy({name: doctor_name});
    // if (!doctorName) {
    //     throw new BadRequestError("Doctor not found");
    //   }

    // const doctor = await DoctorRepository.findOneBy({  specialty});
    // if (!doctor) {
    //   throw new BadRequestError("Doctor not found for this specialty");
    // }

    const overlappingSchedule = await ScheduleRepository.createQueryBuilder('schedule')
      .where('schedule.date = :date', { date })
      .andWhere('schedule.start_time <= :end_time', { end_time })
      .andWhere('schedule.end_time >= :start_time', { start_time })
    //   .andWhere('schedule.id_doctor = :id_doctor', { id_doctor: doctor.id })
      .getOne();

    if (overlappingSchedule) {
      throw new BadRequestError("There is already a appointment for this time interval and doctor");
    }
    
    const newSchedule = await ScheduleRepository.create({
        date,
        start_time,
        end_time
        });

    await ScheduleRepository.save(newSchedule);


    const newAppointment = AppointmentRepository.create({
      id_user: user.id,
      id_doctor: doctor_name.id,
      id_schedule: newSchedule.id,
      id_clinic: clinic_name.id,
    });

    await AppointmentRepository.save(newAppointment);

    return res.status(201).json(newAppointment);
  } 
    
export async function updateAppointment(req: Request, res: Response) {
  try {
    const { id, date, start_time, end_time, clinic_name, specialty, doctor_name } = req.body;
    const user = req.user;
    if (!user) {
      throw new BadRequestError('User not authenticated');
    }

    const existingAppointment = await AppointmentRepository.findOneBy(id);
    if (!existingAppointment) {
      throw new BadRequestError('Appointment not found');
    }

    const clinic = await ClinicRepository.findOneBy({ name: clinic_name });
    if (!clinic) {
      throw new BadRequestError('Clinic not found');
    }

    const doctorName = await PersonRepository.findOneBy({ name: doctor_name });
    if (!doctorName) {
      throw new BadRequestError('Doctor not found');
    }

    const doctor = await DoctorRepository.findOneBy({ id_person: doctorName.id, specialty });
    if (!doctor) {
      throw new BadRequestError('Doctor not found for this specialty');
    }

    const overlappingSchedule = await ScheduleRepository.createQueryBuilder('schedule')
      .where('schedule.date = :date', { date })
      .andWhere('schedule.start_time <= :end_time', { end_time })
      .andWhere('schedule.end_time >= :start_time', { start_time })
      .andWhere('schedule.id_doctor = :id_doctor', { id_doctor: doctor.id })
      .getOne();

    if (overlappingSchedule && overlappingSchedule.id !== existingAppointment.id_schedule) {
      throw new BadRequestError('There is already an appointment for this time interval and doctor');
    }

    await AppointmentRepository.update(
      { id },
      {
        id_doctor: doctor.id,
        id_clinic: clinic.id,
        id_schedule: existingAppointment.id_schedule 
      }
    );

    const updatedAppointment = await AppointmentRepository.findOneBy(id);
    return res.status(200).json(updatedAppointment);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ error: 'Error updating appointment' });
  }
}


export async function deleteAppointment(req: Request, res: Response) {
    try {
        const { id } = req.body;
        const user = req.user;
        if (!user) {
        throw new BadRequestError('User not authenticated');
        }
        const appointment = await AppointmentRepository.findOneBy(id);
        if (!appointment) {
        throw new BadRequestError('Appointment not found');
        }
        await AppointmentRepository.delete(id);
        return res.status(200).json({ message: 'Appointment deleted' });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ error: 'Error deleting appointment' });
    }
}

export async function getAppointments(req: Request, res: Response) {
        const user = req.user;
        if (!user) {
        throw new BadRequestError('User not authenticated');
        }
        const appointments = await AppointmentRepository.find({ where : {id_user: user.id }});
        if (!appointments) {
        throw new BadRequestError('No appointments found');
        }

        const appointmentsData = await Promise.all(appointments.map(async (appointment) => {
        const doctor = await DoctorRepository.findOneBy({ id: appointment.id_doctor });
        if (!doctor) {
            throw new BadRequestError('Doctor not found');
        }
        const doctorName = await PersonRepository.findOneBy({ id: doctor.id_person });
        if (!doctorName) {
            throw new BadRequestError('Doctor not found');
        }
        const clinic = await ClinicRepository.findOneBy({ id: appointment.id_clinic });
        if (!clinic) {
            throw new BadRequestError('Clinic not found');
        }
        const schedule = await ScheduleRepository.findOneBy({ id: appointment.id_schedule });
        if (!schedule) {
            throw new BadRequestError('Schedule not found');
        }
        return {
            id: appointment.id,
            date: schedule.date,
            start_time: schedule.start_time,
            end_time: schedule.end_time,
            doctor: {
                id: doctor.id,
                name: doctorName.name, 
                specialty: doctor.specialty,
            },
            clinic: clinic.name 
        };
    }));

    return res.status(200).json(appointmentsData);
}
