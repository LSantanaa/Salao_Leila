import { Router } from 'express';
import { registerClient, registerAdmin, loginUser } from '../controllers/authController';
import { authenticate, isAdmin } from '../middlewares/auth';

const router = Router();

router.post('/register/client', registerClient);
router.post('/register/admin', authenticate, isAdmin, registerAdmin);
router.post('/login', loginUser);

export default router;