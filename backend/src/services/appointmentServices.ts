import prisma from "../lib/prisma";

interface CreateAppointmentData {
  userId: number;
  serviceId: number;
  dateTime: string;
  useSuggestion?: boolean;
}

interface AppointmentOptions {
  action: "delete" | "update";
  appointmentId: number;
  userId: number;
  serviceId?: number;
  dateTime?: string;
  status?: string;
}

const getAppointment = async (appointmentId: number, userId?: number) => {
  const appointment = await prisma.appointment.findUnique({
    where: { id: appointmentId },
  });
  if (!appointment) {
    throw new Error("Agendamento não encontrado");
  }
  if (userId && appointment.userId !== userId) {
    throw new Error("Agendamento não pertence ao usuário");
  }
  return appointment;
};

const calculateDaysDiff = (dateTime: Date): number => {
  return dateTime.getTime() - new Date().getTime() / (1000 * 60 * 60 * 24);
};

/**
 * Modifica um agendamento por meio de exclusão ou atualização, aplicando a regra de antecedência de 2 dias.
 * @param options - Objeto de opções contendo action, appointmentId, userId e dateTime/status, serviceId opcionais.
 * @param options.action - A ação a ser realizada: 'delete' (excluir) ou 'update' (atualizar).
 * @param options.appointmentId - O ID do agendamento a ser modificado.
 * @param options.userId - O ID do usuário que solicita a modificação.
 * @param options.dateTime - Nova data e hora opcional para a ação de atualização (string ISO).
 * @param options.status - Novo status opcional para a ação de atualização.
 * @returns O objeto do agendamento excluído ou atualizado.
 * @throws {Error} Se a ação for inválida ou a regra de antecedência de 2 dias for violada.
 */
const alterAppointment = async ({
  action,
  appointmentId,
  userId,
  dateTime,
  status,
  serviceId,
}: AppointmentOptions) => {
  const appointment = await getAppointment(appointmentId, userId);
  const diffDays = calculateDaysDiff(appointment.dateTime);
  if (diffDays < 2) {
    const errorMessage = `${
      action === "delete" ? "Cancelamentos" : "Alterações"
    } somente são permitidos com até 2 dias de antecedência. Entre em contato.`;
    throw new Error(errorMessage);
  }

  if (action === "delete") {
    return prisma.appointment.delete({ where: { id: appointmentId } });
  } else {
    return prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        dateTime: dateTime ? new Date(dateTime) : appointment.dateTime,
        status,
        serviceId,
      },
    });
  }
};

/**
 * Busca todos os agendamentos registrados.
 * @returns Uma lista de objetos de agendamento, incluindo dados do usuário e serviço, ordenada por data.
 */
export const fetchAllAppointments = async () => {
  return await prisma.appointment.findMany({
    include: { client: true, service: true },
    orderBy: { dateTime: "asc" },
  });
};

/**
 * Busca todos os agendamentos de um usuário específico.
 * @param userId - O ID do usuário cujos agendamentos serão buscados.
 * @returns Uma lista de objetos de agendamento do usuário, incluindo dados do usuário e serviço, ordenada por data.
 */
export const fetchUserAppointments = async (userId: number) => {
  return await prisma.appointment.findMany({
    where: { userId },
    include: { client: true, service: true },
    orderBy: { dateTime: "asc" },
  });
};

/**
 * Cria um novo agendamento para um cliente, sugerindo o mesmo dia se já houver um na semana.
 * @param options - Objeto de opções contendo action, appointmentId, userId, e dateTime/status/serviceId opcionais.
 * @param options.userId - O ID do cliente que está agendando.
 * @param options.serviceId - O ID do serviço a ser agendado.
 * @param options.dateTime - A data e hora propostas para o agendamento (formato ISO string).
 * @param options.useSuggestion - Define se deve usar o dia sugerido (true) ou o proposto (false). Opcional na primeira chamada.
 * @returns Um objeto de agendamento criado ou uma sugestão com { suggestion, existingId } se houver conflito na semana.
 */
export const createNewAppointment = async ({
  userId,
  serviceId,
  dateTime,
  useSuggestion,
}: CreateAppointmentData) => {
  const proposedDate = new Date(dateTime);
  const startOfWeek = new Date(proposedDate);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);

  const existing = await prisma.appointment.findFirst({
    where: { userId, dateTime: { gte: startOfWeek, lte: endOfWeek } },
  });

  // Se há agendamento na semana e ainda não foi decidido
  if (existing && useSuggestion === undefined) {
    return {
      suggestion: `Agendamento em ${existing.dateTime.toLocaleString("pt-br")}. Deseja usar este dia?`,
      existingId: existing.id,
    };
  }

  // Usa o dia sugerido ou o novo, conforme a escolha
  const finalDateTime = useSuggestion && existing ? existing.dateTime : proposedDate;

  return prisma.appointment.create({
    data: { userId, serviceId, dateTime: finalDateTime, status: "Pendente" },
  });
};


/**
 * Deleta o agendamento se estiver no período permitido.
 * @param appointmentId - O Id do agendamento deletado
 * @param userId - o id do usuário quando deletar.
 * @returns o objeto do agendamento cancelado.
 * @throws {Error} se não for encontrado o agendamento, se não pertencer ao usário e se já estiver com menos de 2 dias.
 */
export const deleteAppointment = async (
  appointmentId: number,
  userId: number
) => {
  return alterAppointment({ action: "delete", appointmentId, userId });
};


/**
 * Altera o agendamento (data, serviço ou status) do seu próprio
 * agendamento desde que atenda o requesito de dois dias.
 * @param options - Objeto de opções contendo action, appointmentId, userId e dateTime/status, serviceId opcionais.
 * @param options.appointmentId - O Id do Agendamento
 * @param options.userId - O Id do usuário logado
 * @param options.dateTime - Opcional para alterar ou manter a mesma data
 * @param options.status - Opcional para atualizar os status do agendamento (os staus para cliente somente é pendente ou cancelado)
 * @param options.serviceId - Opcional para alterar o serviço a ser feito
 * @returns O objeto do agendamento atualizado
 * @throws {Error} se o agendamento não for encontrado
 */
export const updateAppointment = async ({
  appointmentId,
  userId,
  dateTime,
  status,
  serviceId,
}: AppointmentOptions) => {
  return alterAppointment({
    action: "update",
    appointmentId,
    userId,
    dateTime,
    status,
    serviceId,
  });
};


/**
 * Altera o agendamento (data, serviço ou status) sem restrições (admin).
 * @param options - Objeto de opções contendo action, appointmentId, userId e dateTime/status, serviceId opcionais.
 * @param options.appointmentId - O Id do Agendamento
 * @param options.dateTime - Opcional para alterar ou manter a mesma data
 * @param options.status - Opcional para atualizar os status do agendamento (cancelar, confirmar, concluir)
 * @param options.serviceId - Opcional para alterar o serviço a ser feito
 * @returns O objeto do agendamento atualizado
 * @throws {Error} se o agendamento não for encontrado
 */
export const updateAppointmentByAdmin = async ({
  appointmentId,
  dateTime,
  status,
  serviceId,
}: AppointmentOptions) => {
  const appointment = await getAppointment(appointmentId);

  return prisma.appointment.update({
    where: { id: appointmentId },
    data: {
      dateTime: dateTime ? new Date(dateTime) : appointment.dateTime,
      status,
      serviceId,
    },
  });
};
