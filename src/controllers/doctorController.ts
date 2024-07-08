import { Clinic } from './../db/entity/clinic.entity';
import { Specialty } from './../db/entity/doctor.entity';
import { Request, Response } from "express";
import { UserRepository } from "../repositories/userRepository";
import { PersonRepository } from "../repositories/personRepository";
import { BadRequestError } from "../helpers/api-errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { DoctorRepository } from '../repositories/doctorRepository';
import { ClinicRepository } from '../repositories/clinicRepository';

export async function createDoctor(req: Request, res: Response) {
    const { name, cpf, phone, email, crm, specialty, clinic  } = req.body;
    const doctorExists = await DoctorRepository.findOneBy({ crm });
    if (doctorExists) {
      throw new BadRequestError("Doctor with this CRM already exists");
    }
    const newPerson = PersonRepository.create({
      name,
      cpf,
      phone,
      email,
    });
    await PersonRepository.save(newPerson);

    const clinicName = await ClinicRepository.findOneBy({name: clinic})
    if (!clinicName) {
      throw new BadRequestError("Clinic not found");
    }

    const newDoctor = DoctorRepository.create({
        crm,
        specialty,
        id_person: newPerson.id,
        id_clinic: clinicName.id
    })

    await DoctorRepository.save(newDoctor);
    return res.status(201).json(newDoctor);
}