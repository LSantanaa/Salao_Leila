import prisma from '../lib/prisma';

interface ISalonService{
  name:string,
  price: number,
}

/**
 * Cria um novo serviço prestado no banco
 * @param options 
 * @param options.name - Nome do serviço a ser cadastrado 
 * @param options.price - valor do serviço
 * @returns o objeto do serviço cadastrado
 */
export const createSalonService = async ({name, price}: ISalonService)=>{
    if(!name || !price){
      throw new Error('Os campos de nome e preço são obrigatórios')
    }
   return await prisma.service.create({data: {name, price}})
}


/**
 * Edita os dados do serviço já existente, (nome e preço)
 * @param id - O Id do serviço a ser editado
 * @param options - Objeto contendo os dados a serem alterados 
 * @param options.name - Nome a ser alterado 
 * @param options.price - preço a ser alterado
 * @returns o serviço alterado
 */
export const updateSalonService = async(id: number, {name, price}:ISalonService)=>{
    if(!name && !price){
      throw new Error("Os campos devem ser preenchidos")
    }
    return await prisma.service.update({
      where:{id},
      data:{name, price}
    })
}

/**
 * Exclui um serviço do salão, se não estiver atrelado a agendamentos.
 * @param id - ID do serviço a ser excluído.
 * @returns Um objeto com success e data (serviço excluído) ou error (mensagem de erro).
 */
export const deleteSalonService = async (id: number) => {
  // Verifica se o serviço existe
  const service = await prisma.service.findUnique({ where: { id } });
  if (!service) {
    return { success: false, error: "Serviço não encontrado" };
  }

  // Verifica se há agendamentos atrelados
  const appointmentCount = await prisma.appointment.count({
    where: { serviceId: id },
  });
  if (appointmentCount > 0) {
    return { success: false, error: "Não é possível excluir o serviço pois ele está atrelado a agendamentos" };
  }

  // Exclui o serviço se não houver agendamentos
  const deletedService = await prisma.service.delete({ where: { id } });
  return { success: true, data: deletedService };
};


export const fetchAllSalonServices = async () => {
  return await prisma.service.findMany({
    orderBy: { name: 'asc' },
  });
};
