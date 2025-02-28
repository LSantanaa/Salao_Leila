import { Request, Response, NextFunction } from 'express';

/**
 * Middleware global para tratar erros na aplicação Express.
 * Captura erros lançados pelos controllers ou serviços, loga no console e retorna uma resposta JSON padronizada.
 * 
 * @param err - O erro capturado (ex.: lançado por throw ou falha assíncrona).
 * @param req - Objeto de requisição do Express (não modificado aqui).
 * @param res - Objeto de resposta do Express, usado para enviar o erro ao cliente.
 * @param next - Função para passar o controle ao próximo middleware (não usada aqui).
 */

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack); // Loga o stack trace para debug
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500; // Usa status definido ou 500 como padrão
  res.status(statusCode).json({ error: err.message || 'Erro interno no servidor' });
};