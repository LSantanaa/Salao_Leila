import { Router } from 'express';
import { authenticate } from '../middlewares/auth';
import { createAppointment, deleteAppointmentClient, getAllSalonServicesClient, getUserAppointments, updateAppointmentClient } from '../controllers/clientController';

const router = Router();

router.get('/appointments/my', authenticate, getUserAppointments);
router.post('/appointments', authenticate, createAppointment);
router.delete('/appointments/cancel/:appointmentId', authenticate, deleteAppointmentClient);
router.put('/appointments/:appointmentId', authenticate, updateAppointmentClient );

router.get('/services', authenticate, getAllSalonServicesClient)

export default router;