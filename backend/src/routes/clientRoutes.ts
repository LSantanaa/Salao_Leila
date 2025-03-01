import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { createAppointment, deleteAppointmentClient, getUserAppointments, updateAppointmentClient } from '../controllers/clientController';
import { deleteAppointment } from '../services/appointmentServices';

const router = Router();

router.get('/appointments/my', authenticate, getUserAppointments);
router.post('/appointments', authenticate, createAppointment);
router.delete('/appointments/cancel/:appointmentId', authenticate, deleteAppointmentClient);
router.put('/appointments/:appointmentId', authenticate, updateAppointmentClient );

export default router;