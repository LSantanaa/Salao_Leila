import { Router } from "express";
import { authenticate, isAdmin } from "../middlewares/auth";
import {
  getAllAppointments,
  getUserAppointments,
  createAppointment,
} from "../controllers/appointmentController"

const router = Router();

router.get("/", authenticate, isAdmin, getAllAppointments);
router.get("/my", authenticate, getUserAppointments);
router.post("/", authenticate, createAppointment);
// router.delete("/cancel/:appointmentId", authenticate, cancelAppointment);

export default router;
