import prisma from '../lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'salao-leila'; 

type Role = 'admin' | 'client';

/**
 * Cria um usuário com senha criptografada.
 * @param name - nome do usuário
 * @param email - Email único.
 * @param password - Senha em texto plano.
 * @param role - "admin" ou "client".
 */
export const createUser = async (name:string, email: string, password: string, role: Role) => {
  const emailExisting = await prisma.user.findUnique({where: {email}})

  if(!emailExisting){
    const hashedPassword = await bcrypt.hash(password, 10);
  
    return prisma.user.create({
      data: { name,email,pwd: hashedPassword, role },
    });
  }else{
    throw new Error("Email já cadastrado")
  }
};

/**
 * Autentica um usuário e retorna um token JWT.
 * @param email - Email do usuário.
 * @param password - Senha em texto plano.
 * @throws {Error} - se login for inválido
 * @returns - um objeto contendo o token de acesso e o tipo de usuário
 */
export const userLogin = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.pwd))) {
    throw new Error('Credenciais inválidas');
  }
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
  return { token, role: user.role };
};