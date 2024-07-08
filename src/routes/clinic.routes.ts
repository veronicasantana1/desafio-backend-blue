import { Router } from "express";
import { createClinic } from "../controllers/clinicController";

const clinicRouter = Router();

clinicRouter.post("/createClinic", createClinic);

export default clinicRouter;