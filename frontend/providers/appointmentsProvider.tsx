"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { api } from "@/lib/api";
import { useAuth } from "./authProvider";

export type Appointment = {
  id: number;
  dateTime: string;
  status: string;
  user?: {name:string, id: number}; // Para admin ver todos
  service: Service
};

type Service ={
  id: number;
  name: string;
  price: number;
}

type AppointmentsContextType = {
  appointments: Appointment[];
  services: Service[];
  successMessage: string  | null;
  fetchServices: ()=> Promise<void>;
  fetchAppointments: () => Promise<void>;
  createAppointment: (serviceId: number, dateTime: string, useSuggestion?: boolean | undefined) => Promise<{ success: boolean; data?: any; error?: string; suggestion?: string }>;
  cancelAppointment: (id: number) => Promise<any>;
  editAppointment: ({dateTime, id, service, status}:Appointment) => Promise<any>;
  error: string | null;
};

const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined);

export const AppointmentsProvider = ({ children }: { children: ReactNode }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchServices = async () => {
    if(!user) return
    try {
      const endpoint = user.role === "admin" ? "/admin/services" : "/client/services";
      const result = await api(endpoint);
      if (result.success) {
        setServices(result.data);
      } else {
        setError("Erro ao carregar serviços");
      }
    } catch (err) {
      setError("Erro ao carregar serviços");
    }
  };

  const fetchAppointments = async () => {
    if (!user) return;
    try {
      const endpoint = user.role === "admin" ? "/admin/appointments" : "/client/appointments/my";
      const result = await api(endpoint);
      if (result.success) {
        setAppointments(result.data);
        console.log("agendamentos: ",  result.data)
      } else {
        setError("Erro ao carregar agendamentos");
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const createAppointment = async (serviceId: number, dateTime: string, useSuggestion: boolean | undefined) => {
    setError(null)
    setSuccessMessage(null)
    try {
      const result = await api("/client/appointments", {
        method: "POST",
        body: JSON.stringify({ serviceId, dateTime, useSuggestion}),
      });

      if (result.success) {
        console.log("aqui", result.data)
        setSuccessMessage("Agendamento realizado com sucesso, em breve estaremos confirmando!")
        setAppointments((prev) => [...prev, result.data]);
      }
      return result; 
    } catch (err) {
      setError((err as Error).message);
      throw err;
    }
  };

  const cancelAppointment = async (id: number) => {
    if (!user) return;
    setSuccessMessage(null)
    setError(null)
    try {
      const endpoint = user.role === "admin" ? `/admin/appointments/${id}` : `/client/appointments/cancel/${id}`;
      const result = await api(endpoint, { method: "DELETE" });
      console.log(result)
      if (result.success) {
        setError(null)
        setSuccessMessage("Cancelamento realizado com sucesso.")
        setAppointments((prev) => prev.filter((appt) => appt.id !== id));
        return result;
      } else {
        setError(result.error);
        return result
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const editAppointment = async ({id, dateTime, service, status}:Appointment) => {
    if (!user) return;
    setError(null)
    setSuccessMessage(null)
    try {
      const endpoint = user.role === "admin" ? `/admin/appointments/${id}` : `/client/appointments/${id}`;
      const result = await api(endpoint, {
        method: "PUT",
        body: JSON.stringify({ dateTime, serviceId:service.id, status: user.role === 'client'? "pendente" : status }),
      });
      console.log(result)
      if (result.success) {
        setSuccessMessage("Alteração realizada com sucesso. Aguarde a confirmação.")
        setAppointments((prev) => prev.map((appt) => (appt.id === id ? result.data : appt)));
        return result
      } else {
        setError(result.error);
        return result
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  useEffect(()=>{
    setTimeout(()=>{
      setSuccessMessage(null)
      setError(null)
    },6000)
  },[successMessage, error])

  useEffect(() => {
    fetchAppointments();
    fetchServices();
  }, [user]);

  return (
    <AppointmentsContext.Provider value={{ appointments,services, successMessage, fetchServices, fetchAppointments, createAppointment, cancelAppointment, editAppointment, error }}>
      {children}
    </AppointmentsContext.Provider>
  );
};

export const useAppointments = () => {
  const context = useContext(AppointmentsContext);
  if (!context) {
    throw new Error("useAppointments deve ser usado dentro de um AppointmentsProvider");
  }
  return context;
};