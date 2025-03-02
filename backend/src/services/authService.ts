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
  if(emailExisting){
    return {success: false, error:"Email já cadastrado."}
  }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({data: { name,email,pwd: hashedPassword, role }, });

    const token = jwt.sign({id:user.id,role:user.role}, JWT_SECRET, {expiresIn:'2h'});

    return {success: true, data: {token, role: user.role, name:user.name}}
};

/**
 * Autentica um usuário e retorna um token JWT.
 * @param email - Email do usuário.
 * @param password - Senha em texto plano.
 * @returns - um objeto contendo o token de acesso e o tipo de usuário
 */
export const userLogin = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.pwd))) {
    return {success: false, error: "Credenciais inválidas"};
  }
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '2h' });
  return { success: true, data:{token, role: user.role, name: user.name} };
};