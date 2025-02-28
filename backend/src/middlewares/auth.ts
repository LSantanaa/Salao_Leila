import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'salao-leila';

interface AuthRequest extends Request {
  user?: { id: number; role: string };
}

/**
 * Verifica o token JWT no header Authorization.
 */
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    res.status(401);
    throw new Error('Não autenticado');
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role: string };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Token inválido');
  }
};

/**
 * Restringe acesso a administradores.
 */
export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    res.status(403);
    throw new Error('Acesso negado: apenas administradores');
  }
  next();
};