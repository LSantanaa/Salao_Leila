import { Request, Response } from 'express';
import { asyncHandler } from '../lib/asyncHandler';
import { createUser, userLogin } from '../services/authService';

interface AuthRequest extends Request {
  user?: { id: number; role: string };
}

/**
 * Cadastra um novo cliente no sistema (acesso público).
 * @param req - Requisição com name, email e password no body.
 * @param res - Resposta com o cliente criado.
 * @throws {Error} Se campos obrigatórios estiverem faltando.
 * @returns {Json} Retorna o usuário cadastrado
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
 * Cadastra um novo admin no sistema (restrito a admins logados).
 * @param req - Requisição com name, email e password no body.
 * @param res - Resposta com o admin criado.
 * @throws {Error} Se campos obrigatórios estiverem faltando ou acesso negado.
 * @returns {Json} Retorna o admin cadastrado
 */
export const registerAdmin = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Campos obrigatórios faltando');
  }
  const user = await createUser(name, email, password, 'admin');
  res.status(201).json(user);
});

/**
 * Autentica um usuário (admin ou client) e retorna um token JWT.
 * @param req - Requisição com email e password no body.
 * @param res - Resposta com token e role.
 * @throws {Error} Se credenciais forem inválidas.
 * @returns {Json} token e tipo de usuário
 */
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if(!email || !password){
    res.status(400);
    throw new Error("Campos email e password são obrigatórios para logar.")
  }
  const { token, role } = await userLogin(email, password);
  res.json({ token, role });
});