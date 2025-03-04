"use client";

import { useState } from "react";
import { useAppointments } from "@/providers/appointmentsProvider";


export default function AdminDashboard() {
  const { appointments, error } = useAppointments();
  const [filter, setFilter] = useState<"day" | "week" | "month" | "all">("all");


  const filterAppointments = () => {
    const now = new Date();
    const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD atual

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Início da semana (domingo)
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Fim da semana (sábado)
    endOfWeek.setHours(23, 59, 59, 999);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    return appointments.filter((appt) => {
      const apptDate = new Date(appt.dateTime);
      const apptDateStr = apptDate.toISOString().split("T")[0]; // YYYY-MM-DD do agendamento

      switch (filter) {
        case "day":
          return apptDateStr === todayStr;
        case "week":
          return apptDate >= startOfWeek && apptDate <= endOfWeek;
        case "month":
          return apptDate >= startOfMonth && apptDate <= endOfMonth;
        default:
          return true; // 'all'
      }
    });
  };

  const filteredAppointments = filterAppointments();

  const totalAppointments = filteredAppointments.length;
  const completedAppointments = filteredAppointments.filter((appt) => appt.status === "concluido").length;
  const pendingAppointments = filteredAppointments.filter((appt) => appt.status === "pendente").length;
  const canceledAppointments = filteredAppointments.filter((appt) => appt.status === "cancelado").length;

  // Cálculo do valor total (assumindo que cada serviço tem um preço em appt.service.price)
  const totalValue = filteredAppointments
    .filter((appt) => appt.status === "concluido") 
    .reduce((sum, appt) => sum + (appt.service.price || 0), 0)
    .toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div>
      <main className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">

        <div className="mb-6 flex space-x-2">
          <button
            onClick={() => setFilter("day")}
            className={`py-1 px-3 rounded-md ${filter === "day" ? "bg-rose-500 text-white" : "bg-rose-200 text-rose-700"} hover:bg-rose-400`}
          >
            Dia
          </button>
          <button
            onClick={() => setFilter("week")}
            className={`py-1 px-3 rounded-md ${filter === "week" ? "bg-rose-500 text-white" : "bg-rose-200 text-rose-700"} hover:bg-rose-400`}
          >
            Semana
          </button>
          <button
            onClick={() => setFilter("month")}
            className={`py-1 px-3 rounded-md ${filter === "month" ? "bg-rose-500 text-white" : "bg-rose-200 text-rose-700"} hover:bg-rose-400`}
          >
            Mês
          </button>
          <button
            onClick={() => setFilter("all")}
            className={`py-1 px-3 rounded-md ${filter === "all" ? "bg-rose-500 text-white" : "bg-rose-200 text-rose-700"} hover:bg-rose-400`}
          >
            Todos
          </button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-rose-100 rounded-md text-center">
            <h3 className="text-lg font-semibold text-rose-700">Total</h3>
            <p className="text-2xl text-rose-900">{totalAppointments}</p>
          </div>
          <div className="p-4 bg-pink-100 rounded-md text-center">
            <h3 className="text-lg font-semibold text-pink-700">Concluídos</h3>
            <p className="text-2xl text-pink-900">{completedAppointments}</p>
          </div>
          <div className="p-4 bg-rose-100 rounded-md text-center">
            <h3 className="text-lg font-semibold text-rose-700">Pendentes</h3>
            <p className="text-2xl text-rose-900">{pendingAppointments}</p>
          </div>
          <div className="p-4 bg-pink-100 rounded-md text-center">
            <h3 className="text-lg font-semibold text-pink-700">Cancelados</h3>
            <p className="text-2xl text-pink-900">{canceledAppointments}</p>
          </div>
        </div>

        {/* Valor Total */}
        <div className="p-4 bg-rose-200 rounded-md text-center mb-6">
          <h3 className="text-lg font-semibold text-rose-700">Valor Total (Concluídos)</h3>
          <p className="text-2xl text-rose-900">{totalValue}</p>
        </div>

        {/* Lista de Agendamentos */}
        {error && (
          <p className="text-sm bg-rose-500 my-4 font-semibold text-center p-2 rounded-md text-rose-200">{error}</p>
        )}
      </main>
    </div>
  );
}