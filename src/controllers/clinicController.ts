import { Request, Response } from "express";
import { BadRequestError } from "../helpers/api-errors";
import { ClinicRepository } from "../repositories/clinicRepository";

export async function createClinic(req: Request, res: Response) {
  try {
    const { name, address, phone, cnpj, cep } = req.body;
    const clinicExists = await ClinicRepository.findOneBy({ address });
    const validCep = /^[0-9]{5}-?[0-9]{3}$/;
    if (clinicExists) {
      throw new BadRequestError("Clinic already exists");
    }
    if (!validCep.test(cep)) {
      throw new BadRequestError("Invalid CEP");
    }
    const newClinic = ClinicRepository.create({
      name,
      address,
      phone,
      cnpj,
      cep
    });

    await ClinicRepository.save(newClinic);

    return res.status(201).json(newClinic);
  } catch (error) {
    console.error(error);
    throw new BadRequestError("Error creating Clinic");
  }
}