import { Request, Response, NextFunction } from 'express';

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>;

/**
 * Envolve handlers assíncronos para capturar erros e passá-los ao middleware de erro.
 * @param fn - Função assíncrona do controller.
 * @returns Função ajustada que trata erros via next().
 */
export const asyncHandler = (fn: AsyncHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};