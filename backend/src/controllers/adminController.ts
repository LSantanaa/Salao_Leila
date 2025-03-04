import { Request, Response } from "express";
import { deleteAppointmentByAdmin, fetchAllAppointments, updateAppointmentByAdmin } from "../services/appointmentServices";
import { asyncHandler } from "../lib/asyncHandler";
import { createSalonService, deleteSalonService, fetchAllSalonServices, updateSalonService } from "../services/salonService";

interface AuthRequest extends Request {
  user?: { id: number; role: string };
}

/**
 * Funções pertinentes a administração de serviços 
 * prestados no salão (Criar, alterar, deletar, listar)
 */
export const addSalonService = asyncHandler(
  async(req: AuthRequest, res: Response)=>{
    const {name, price} = req.body;
    const service = await createSalonService({name, price});
    res.status(201).json(service);
  }
)

export const editSalonService = asyncHandler(
  async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { name, price } = req.body;
  const service = await updateSalonService(parseInt(id), {name, price});
  res.json(service);
});

export const delSalonService = asyncHandler(
  async(req: AuthRequest, res:Response)=>{
    const {id} = req.params;
    const result = await deleteSalonService(parseInt(id))
    if(result.success){
      res.json({message: 'Serviço excluído com sucesso', data:result.data})
    }else{
      res.status(400).json({error: result.error})
    }
    
  }
)

export const getAllSalonServices = asyncHandler(
  async(req:AuthRequest, res: Response)=>{
    const services = await fetchAllSalonServices();
    res.json(services)
  }
)


/**Funções pertinentes aos agendamentos 
 * (Alterar, Deletar, confirmar, listar)
 */
export const getAllAppointments = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const appointments = await fetchAllAppointments();
    res.json(appointments);
  }
);

export const updateAppointmentAdm = asyncHandler(
  async (req: AuthRequest, res)=>{
    const {id} = req.params
    const {dateTime, status, serviceId} = req.body
    const editAppointment = {appointmentId:parseInt(id), dateTime, status, serviceId}
    const appointment = await updateAppointmentByAdmin(editAppointment)
    if(appointment.success){
      res.json(appointment.data)
    }else{
      res.status(400).json({error: "Alteração não realizada"})
    }
  }
)

export const deleteAppointmentAdm = asyncHandler(
  async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const appointment = await deleteAppointmentByAdmin(parseInt(id));
  if(appointment.success){
    res.send(appointment.deleted)
  }
});
