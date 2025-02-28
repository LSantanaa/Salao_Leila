import { Request, Response } from "express";
import {
  createNewAppointment,
  fetchAllAppointments,
  fetchClientAppointments,
} from "../services/appointmentServices";
import { asyncHandler } from "../lib/asyncHandler";

export const getAllAppointments = asyncHandler(
  async (req: Request, res: Response) => {
    const appointments = await fetchAllAppointments();
    res.json(appointments);
  }
);

export const getClientAppointments = asyncHandler(
  async (req: Request, res: Response) => {
    const { clientId } = req.body;
    const clientAppointments = await fetchClientAppointments(clientId);
    res.json(clientAppointments);
  }
);

export const createAppointment = asyncHandler(
  async (req: Request, res: Response) => {
    const { clientId, serviceId, timeStamp, useSuggestion } = req.body;

    if (!clientId || !serviceId || !timeStamp) {
      res.status(400);
      throw new Error("Campos devem ser obrigatórios");
    }

    const result = await createNewAppointment({
      clientId,
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
