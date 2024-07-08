import { Router } from "express";
import { createDoctor } from "../controllers/doctorController";
const doctorRouter = Router();

doctorRouter.post("/createDoctor", createDoctor);

export default doctorRouter;