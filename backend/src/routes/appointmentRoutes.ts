/**
 * Rotas para gerenciamento de agendamentos.
 * @module routes/appointments
 */

import { Router } from 'express';
import { 
  getAllAppointments, 
  getClientAppointments, 
  createAppointment, 
  cancelAppointment 
} from '../controllers/appointmentController';

const router = Router();

// Buscar todos os agendamentos (somente admin)
router.get('/', getAllAppointments);

// Buscar agendamentos por cliente
router.get('/:clientId', getClientAppointments);

// Criar um novo agendamento
router.post('/', createAppointment);

// Cancelar um agendamento
router.delete('/cancel/:appointmentId', cancelAppointment);

export default router;