import { Router } from "express";
import userRouter from "./user.routes";
import clinicRouter from "./clinic.routes";
import AppointmentRouter from "./appointment.routes";
import doctorRouter from "./doctor.routes";

const routes = Router();

routes.use('/users', userRouter)
routes.use('/clinic', clinicRouter)
routes.use('/appointment', AppointmentRouter)
routes.use('/doctor', doctorRouter)

export default routes;
