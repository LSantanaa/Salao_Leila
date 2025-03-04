"use client";

import { useState } from "react";
import { Appointment, useAppointments } from "@/providers/appointmentsProvider";
import { useAuth } from "@/providers/authProvider";

export default function AppointmentCard({appointment,}: {appointment: Appointment;}) {
  const { cancelAppointment, editAppointment, services } = useAppointments();
  const { user } = useAuth();
  const [serviceId, setServiceId] = useState<string>(String(appointment.service.id));
  const [status, setStatus] = useState<string>(appointment.status);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newDateTime, setNewDateTime] = useState(appointment.dateTime ? appointment.dateTime.split("T")[0] : "");
  const disabled = user?.role === "client" && (appointment.status === "cancelado" || appointment.status === "concluido")
  const statusAppt = appointment.status;

  const statusClass = ()=>{
    switch (statusAppt) {
      case "Pendente":
        return "text-yellow-600";
      case "cancelado":
        return "text-rose-700";
      case "confirmado":
        return "text-green-700";
      case "concluido":
        return "text-gray-500";
      default:
        return "";
    }
  }

  const handleCancel = async () => {
    try {
      const cancel = await cancelAppointment(appointment.id);
      if (cancel.success) {
        setError(null);
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newService = services.filter((s) => String(s.id) === serviceId)[0];
      const editAppt = {
        id: appointment.id,
        dateTime: newDateTime,
        service: newService,
        status,
      };
      const editRes = await editAppointment(editAppt);
      if (editRes.success) {
        setIsEditing(false);
        setServiceId(String(appointment.service.id));
        setNewDateTime(appointment.dateTime);
        setError(null);
      }
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <li className="p-4 border border-rose-200 rounded-md">
      {isEditing ? (
        <form onSubmit={handleEdit} className="space-y-2">
          <p className="text-rose-700">
            {appointment.service.name} - <b className={statusClass()}>{appointment.status}</b>
          </p>
          <input
            type="date"
            value={newDateTime}
            onChange={(e) => setNewDateTime(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
          />
          {error && <p className="text-sm text-rose-600">{error}</p>}

          <label
            htmlFor="service"
            className="block text-sm font-medium text-gray-700"
          >
            Serviço
          </label>
          <select
            required
            id="service"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            <option value="">Selecione um serviço</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} - R${s.price}
              </option>
            ))}
          </select>

          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700"
          >
            Serviço
          </label>
          {user?.role === "admin" && (
            <select
              required
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              <option value="">Selecione o Status</option>
              <option value="pendente">Pendente</option>
              <option value="confirmado">Confirmado</option>
              <option value="concluido">Concluído</option>
              <option value="cancelado">Cancelado</option>
            </select>
          )}

          <div className="flex space-x-2 gap-2">
            <button
              type="submit"
              className="py-1 px-3 bg-rose-500 text-white rounded-md hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-400"
            >
              Salvar
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="py-1 px-3 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : (
        <>
          <p className="text-rose-700 capitalize">
            {appointment.service.name} -{" "}
            {appointment.dateTime
              ? new Date(appointment.dateTime).toLocaleDateString("pt-BR", {
                  timeZone: "UTC",
                })
              : "Data inválida"}{" "}
            -{" "}
            <b className={statusClass()}>
              {appointment.status}
            </b>
          </p>
          {error && <p className="text-sm text-rose-600 mt-1">{error}</p>}
          <div className="relative text-sm flex  gap-2 text-rose-200">
            <button
              disabled={disabled}
              onClick={() => {
                setIsEditing(true);
              }}
              className={`mt-2 py-1 px-3 ${disabled? "bg-rose-300 text-rose-400" : " bg-rose-950 hover:bg-pink-800 text-white"}  rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400`}
            >
              Editar
            </button>
            <button
              onClick={handleCancel}
              className="mt-2 py-1 px-3 bg-rose-950 text-white rounded-md hover:bg-pink-800 focus:outline-none focus:ring-2 focus:ring-pink-400"
            >
              Cancelar
            </button>
            <span className="absolute bottom-2 right-2 font-bold text-rose-950">
              R$ {appointment.service.price}
            </span>
          </div>
        </>
      )}
    </li>
  );
}
