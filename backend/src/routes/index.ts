/**
 * Ponto de entrada das rotas da API.
 * @module routes/index
 */

import { Router } from 'express';
import authRoutes from './authRoutes';
import adminRoutes from './adminRoutes'
import clientRoutes from './clientRoutes'

const router = Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/client', clientRoutes);


export default router;