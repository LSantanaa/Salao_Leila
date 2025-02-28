import { Request, Response } from 'express';
import { asyncHandler } from '../lib/asyncHandler';
import { createUser, userLogin } from '../services/authService';

interface AuthRequest extends Request {
  user?: { id: number; role: string };
}

/**
 * Cadastra um cliente (público).
 */
export const registerClient = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Campos obrigatórios faltando');
  }
  const user = await createUser(name, email, password, 'client');
  res.status(201).json(user);
});

/**
 * Cadastra um admin (restrito a admins logados).
 */
export const registerAdmin = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error('Campos obrigatórios faltando');
  }
  const user = await createUser(name, email, password, 'admin');
  res.status(201).json(user);
});

/**
 * Autentica um usuário (admin ou client).
 */
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { token, role } = await userLogin(email, password);
  res.json({ token, role });
});