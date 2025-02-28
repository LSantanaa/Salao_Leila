import { Request, Response } from "express";
import {
  createNewAppointment,
  fetchAllAppointments,
  fetchUserAppointments,
} from "../services/appointmentServices";
import { asyncHandler } from "../lib/asyncHandler";

interface AuthRequest extends Request {
  user?: { id: number; role: string };
}

export const getAllAppointments = asyncHandler(
  async (req: Request, res: Response) => {
    const appointments = await fetchAllAppointments();
    res.json(appointments);
  }
);

export const getUserAppointments = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const  userId  = req.user!.id;
    const clientAppointments = await fetchUserAppointments(userId);
    res.json(clientAppointments);
  }
);


export const createAppointment = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { serviceId, timeStamp, useSuggestion } = req.body;
    const userId = req.user!.id

    if (!userId || !serviceId || !timeStamp) {
      res.status(400);
      throw new Error("Campos devem ser obrigatórios");
    }

    const result = await createNewAppointment({
      userId,
      serviceId,
      timeStamp,
      useSuggestion,
    });

    if ("suggestion" in result) {
      res.status(200).json(result);
    }else{
      res.status(201).json(res);
    }
  }
);
