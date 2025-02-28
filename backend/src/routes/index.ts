/**
 * Ponto de entrada das rotas da API.
 * @module routes/index
 */

import { Request, Response, Router } from 'express';
import authRoutes from './authRoutes';
import appointmentRoutes from './appointmentRoutes';

const router = Router();

// Rota de teste
router.get('/', (req: Request, res: Response)=>{res.send('ping')})

// Montagem das rotas
router.use('/auth', authRoutes);
router.use('/appointments', appointmentRoutes);


export default router;