import { Request, Response } from "express";
import { UserRepository } from "../repositories/userRepository";
import { PersonRepository } from "../repositories/personRepository";
import { BadRequestError } from "../helpers/api-errors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function createUser(req: Request, res: Response) {
  try {
    const { email, password, name, cpf, phone } = req.body;
    const userExists = await UserRepository.findOneBy({ email });
    if (userExists) {
      throw new BadRequestError("E-mail already exists");
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
  } catch (error) {
    console.error(error);
    throw new BadRequestError("Error creating user");
  }
}

export async function userLogin(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const user = await UserRepository.findOneBy({ email });
    if (!user) {
      throw new BadRequestError("User not found");
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new BadRequestError("Invalid password");
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET ?? "", {
      expiresIn: "8h",
    });
    const { password: _, ...userData } = user;
    return res.json({ userData, token: token });
  } catch (error) {
    console.error(error);
    throw new BadRequestError("Error logging in user");
  }
}

export async function getUserData(req: Request, res: Response) {
  return res.json(req.user);
}
