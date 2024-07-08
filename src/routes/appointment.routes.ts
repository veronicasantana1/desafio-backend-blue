import { authMiddleware } from './../middlewares/authMiddleware';
import { Appointment } from './../db/entity/appointment.entity';
import { Router } from "express";
import { createAppointment } from "../controllers/appointmentController";

const AppointmentRouter = Router();

AppointmentRouter.post("/createAppointment", authMiddleware, createAppointment);

export default AppointmentRouter;