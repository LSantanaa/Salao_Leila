/**
 * Ponto de entrada das rotas da API.
 * @module routes/index
 */

import { Request, Response, Router } from 'express';
import userRoutes from './userRoutes';
import appointmentRoutes from './appointmentRoutes';

const router = Router();

// Rota de teste
router.get('/', (req: Request, res: Response)=>{res.send('ping')})

// Montagem das rotas
router.use('/users', userRoutes);
router.use('/appointments', appointmentRoutes);

export default router;