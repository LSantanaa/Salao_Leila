import { Request, Response } from "express";
import {
  createNewAppointment,
  deleteAppointment,
  fetchAllAppointments,
  fetchUserAppointments,
  updateAppointment,
} from "../services/appointmentServices";
import { asyncHandler } from "../lib/asyncHandler";

interface AuthRequest extends Request {
  user?: { id: number; role: string };
}


export const getUserAppointments = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const  userId  = req.user!.id;
    const clientAppointments = await fetchUserAppointments(userId);
    res.json(clientAppointments);
  }
);


export const createAppointment = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { serviceId, dateTime, useSuggestion } = req.body;
    const userId = req.user!.id

    if (!userId || !serviceId || !dateTime) {
      res.status(400);
      throw new Error("Campos devem ser obrigatórios");
    }

    const result = await createNewAppointment({
      userId,
      serviceId,
      dateTime,
      useSuggestion,
    });

    if ("suggestion" in result) {
      res.status(200).json(result);
    }else{
      res.status(201).json(res);
    }
  }
);


export const deleteAppointmentClient = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { appointmentId } = req.params;
  const userId = req.user!.id;
  await deleteAppointment(parseInt(appointmentId), userId);
  res.json({ message: 'Agendamento excluído.' });
});

export const updateAppointmentClient = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { appointmentId } = req.params;
  const { dateTime, serviceId } = req.body;
  const userId = req.user!.id;
  const editAppointment = {appointmentId:parseInt(appointmentId),userId, dateTime, serviceId: parseInt(serviceId)}
  const appointment = await updateAppointment(editAppointment);
  res.json(appointment);
});