import { authMiddleware } from './../middlewares/authMiddleware';
import { Appointment } from './../db/entity/appointment.entity';
import { Router } from "express";
import { createAppointment, deleteAppointment, getAppointments, updateAppointment } from "../controllers/appointmentController";

const AppointmentRouter = Router();

AppointmentRouter.post("/createAppointment", authMiddleware, createAppointment);
AppointmentRouter.post("/updateAppointment", authMiddleware, updateAppointment) 
AppointmentRouter.get("/getAppointments", authMiddleware, getAppointments) 
AppointmentRouter.post("/deleteAppointment", authMiddleware, deleteAppointment)
export default AppointmentRouter;