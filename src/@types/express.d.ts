import { User } from "../db/entity/user.entity";

declare global {
    namespace Express{
        export interface Request {
            user: Partial<User>
        }
    }
}