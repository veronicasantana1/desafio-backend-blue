import { AppDataSource } from "../data-source";
import { Person } from "../db/entity/person.entity";

export const PersonRepository = AppDataSource.getRepository(Person)
