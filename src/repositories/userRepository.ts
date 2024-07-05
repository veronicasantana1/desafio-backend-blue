import { AppDataSource } from "../data-source";
import { User } from "../db/entity/user.entity";

export const UserRepository = AppDataSource.getRepository(User)