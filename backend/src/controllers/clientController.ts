import { Request, Response } from "express";
import {
  createNewAppointment,
  deleteAppointment,
  fetchUserAppointments,
  updateAppointment,
} from "../services/appointmentServices";
import { asyncHandler } from "../lib/asyncHandler";
import { fetchAllSalonServices } from "../services/salonService";

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

export const getAllSalonServicesClient = asyncHandler(
  async(req:AuthRequest, res: Response)=>{
    const services = await fetchAllSalonServices();
    res.json(services)
  }
)


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
    
    if("suggestion" in result) {
      res.status(202).json(result);
    }else if(result.success){
      res.status(201).json(result.data);
    }
  }
);


export const deleteAppointmentClient = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { appointmentId } = req.params;
  const userId = req.user!.id;
  const result = await deleteAppointment(parseInt(appointmentId), userId);
  if(result.success){
    res.json(result.deleted)
  }else{
    res.status(400).json({ error: result.error });
  }
});

export const updateAppointmentClient = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { appointmentId } = req.params;
  const { dateTime, serviceId, status } = req.body;
  const userId = req.user!.id;
  const editAppointment = {appointmentId:parseInt(appointmentId),userId, dateTime, serviceId: parseInt(serviceId), status}
  const result = await updateAppointment(editAppointment);
  
  if(result.success){
    res.json(result.data);
  }else{
    res.status(400).json(result)
  }

});