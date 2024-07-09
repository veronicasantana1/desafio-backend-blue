import { Request, Response } from "express";
import { UserRepository } from "../repositories/userRepository";
import { PersonRepository } from "../repositories/personRepository";
import { BadRequestError } from "../helpers/api-errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);
export async function createUser(req: Request, res: Response) {
    const { email, password, name, cpf, phone } = req.body;
    const userExists = await UserRepository.findOneBy({ email });
    if (userExists) {
      throw new BadRequestError("Email já cadastrado");
    }
    const newPerson = PersonRepository.create({
      name,
      cpf,
      phone,
      email,
    });
    await PersonRepository.save(newPerson);

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = UserRepository.create({
      email,
      id_person: newPerson.id,
      password: passwordHash,
    });
    await UserRepository.save(newUser);

    const { password: _, ...user } = newUser;
    return res.status(201).json(user);
}

export async function userLogin(req: Request, res: Response) {
    const { email, password } = req.body;
    const user = await UserRepository.findOneBy({ email });
    if (!user) {
      throw new BadRequestError("Usuário não encontrado");
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new BadRequestError("Senha incorreta");
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET ?? "", {
      expiresIn: "8h",
    });
    const { password: _, ...userData } = user;
    return res.json({ userData, token: token });
}

export async function getUserData(req: Request, res: Response) {
  return res.json(req.user);
}


