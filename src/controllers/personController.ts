import { Request, Response } from 'express';
import { PersonRepository } from '../repositories/personRepository';

export async function createPerson(req: Request, res: Response) {
    try {
        const { name, age, email } = req.body;
        const personExists = await PersonRepository.findOneBy({ email });
        if (personExists) {
            return res.status(400).json({ message: "Person already exists" });
        }
    } catch (error) {
        return res.status(500).json(error);
    }
}