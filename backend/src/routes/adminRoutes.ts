import { Router } from "express";
import { authenticate, isAdmin } from "../middlewares/auth";
import {
  addSalonService,
  deleteAppointmentAdm,
  delSalonService,
  editSalonService,
  getAllAppointments,
  getAllSalonServices,
  updateAppointmentAdm,
} from "../controllers/adminController";
import { deleteSalonService, updateSalonService } from "../services/salonService";

const router = Router();

/**
 * rotas referentes ao agendamento (admin)
 */
router.get("/appointments", authenticate, isAdmin, getAllAppointments);
router.put("/appointments/:id", authenticate, isAdmin, updateAppointmentAdm);
router.delete("/appointments/:id", authenticate, isAdmin, deleteAppointmentAdm);

/**
 * rotas referentes aos serviços do salão (admin)
 */
router.post("/services", authenticate, isAdmin, addSalonService);
router.put("/services/:id", authenticate, isAdmin, editSalonService);
router.get("/services", authenticate, isAdmin, getAllSalonServices);
router.delete("/services/:id", authenticate, isAdmin, delSalonService);


export default router;
