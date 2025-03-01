import prisma from '../lib/prisma';

interface ISalonService{
  name:string,
  price: number,
}

export const createSalonService = async ({name, price}: ISalonService)=>{
    if(!name || !price){
      throw new Error('Os campos de nome e preço são obrigatórios')
    }
   return await prisma.service.create({data: {name, price}})
}

export const updateSalonService = async(id: number, {name, price}:ISalonService)=>{
    if(!name && !price){
      throw new Error("Os campos devem ser preenchidos")
    }
    return await prisma.service.update({
      where:{id},
      data:{name, price}
    })
}

export const deleteSalonService = async (id:number)=>{

  const serviceFind = await prisma.service.findUnique({where:{id}})

  if(serviceFind){
    return await prisma.service.delete({where:{id}})
  }
}


export const fetchAllSalonServices = async () => {
  return await prisma.service.findMany({
    orderBy: { name: 'asc' },
  });
};
