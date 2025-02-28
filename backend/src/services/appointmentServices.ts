import prisma from "../lib/prisma";

interface CreateAppointmentData {
  userId: number;
  serviceId: number;
  timeStamp: string;
  useSuggestion?: boolean;
}


export const fetchAllAppointments = async () => {
  return await prisma.appointment.findMany({
    include: { client: true, service: true },
    orderBy: { timeStamp: "asc" },
  });
};


export const fetchUserAppointments = async (userId: number) => {
  return await prisma.appointment.findMany({
    where:{
      userId, 
    },
    include:{ client: true, service: true },
    orderBy:{timeStamp: 'asc'}
  })
};



/**
 * Cria um novo agendamento para um cliente, sugerindo o mesmo dia se já houver um na semana.
 * 
 * @param userId - O ID do cliente que está agendando.
 * @param serviceId - O ID do serviço a ser agendado.
 * @param timeStamp - A data e hora propostas para o agendamento (formato ISO string).
 * @param useSuggestion - Define se deve usar o dia sugerido (true) ou o proposto (false). Opcional na primeira chamada.
 * @returns Um objeto de agendamento criado ou uma sugestão com { suggestion, existingId } se houver conflito na semana.
 */

export const createNewAppointment = async ({ userId, serviceId, timeStamp, useSuggestion }: CreateAppointmentData) => {
  const proposedDate = new Date(timeStamp);
  const startOfWeek = new Date(proposedDate);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);

  const existing = await prisma.appointment.findFirst({
    where: { userId, timeStamp: { gte: startOfWeek, lte: endOfWeek } },
  });

  // Se há agendamento na semana e ainda não foi decidido
  if (existing && useSuggestion === undefined) {
    return { suggestion: `Agendamento em ${existing.timeStamp.getDate().toLocaleString('pt-br')}. Deseja usar este dia?`, existingId: existing.id };
  }

  // Usa o dia sugerido ou o novo, conforme a escolha
  const finalTimeStamp = useSuggestion && existing ? existing.timeStamp : proposedDate;
  
  return prisma.appointment.create({
    data: { userId, serviceId, timeStamp: finalTimeStamp, status: 'Agendado' },
  });
};


