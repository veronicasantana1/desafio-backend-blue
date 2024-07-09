import { Request, Response } from "express";
import { BadRequestError } from "../helpers/api-errors";
import { ClinicRepository } from "../repositories/clinicRepository";
import dayjs from "dayjs";

export async function createClinic(req: Request, res: Response) {
    const { name, address, phone, cnpj, cep } = req.body;
    const clinicExists = await ClinicRepository.findOneBy({ address });
    const validCep = /^[0-9]{5}-?[0-9]{3}$/;
    if (clinicExists) {
      throw new BadRequestError("Clínica já cadastrada");
    }
    if (!validCep.test(cep)) {
      throw new BadRequestError("CEP Inválido, utilize o formato 00000-000 ou 00000000");
    }
    const newClinic = ClinicRepository.create({
      name,
      address,
      phone,
      cnpj,
      cep,
      created_at: dayjs().utc().toDate(),
      updated_at: dayjs().utc().toDate(), 
    });

    await ClinicRepository.save(newClinic);

    return res.status(201).json(newClinic);
  }