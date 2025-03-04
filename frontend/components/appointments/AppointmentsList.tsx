"use client";
import { useAppointments } from "@/providers/appointmentsProvider";
import AppointmentCard from "./AppointmentCard";
import { useState } from "react";

export default function AppointmentsList() {
  const { appointments, error, successMessage } = useAppointments();
  const [filter, setFilter] = useState<"day" | "week" | "month" | "all">("all");

  const filterAppointments = () => {
    const now = new Date();

    // Data atual sem horário (YYYY-MM-DD)
    const todayStr = new Date().toISOString().split("T")[0];

    // Início e fim da semana (domingo a sábado)
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Vai para domingo
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Vai para sábado
    endOfWeek.setHours(23, 59, 59, 999);

    //início do mês
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    //fim do mês
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    return appointments.filter((appt) => {
      const apptDate = new Date(appt.dateTime);
      const apptDateStr = apptDate.toISOString().split("T")[0]; // Apenas YYYY-MM-DD

      switch (filter) {
        case "day":
          return apptDateStr === todayStr;
        case "week":
          return apptDate >= startOfWeek && apptDate <= endOfWeek;
        case "month":
          return apptDate >= startOfMonth && apptDate <= endOfMonth;
        default:
          return true;
      }
    });
  };

  const filteredAppointments = filterAppointments();

  return (
    <div>
      <h2 className="text-xl font-bold text-rose-700 mb-4">
        Meus Agendamentos
      </h2>
      <div className="mb-4 flex space-x-2">
        <button
          onClick={() => setFilter("day")}
          className={`py-1 px-3 rounded-md ${
            filter === "day"
              ? "bg-rose-500 text-white"
              : "bg-rose-200 text-rose-700"
          } hover:bg-rose-400`}
        >
          Dia
        </button>
        <button
          onClick={() => setFilter("week")}
          className={`py-1 px-3 rounded-md ${
            filter === "week"
              ? "bg-rose-500 text-white"
              : "bg-rose-200 text-rose-700"
          } hover:bg-rose-400`}
        >
          Semana
        </button>
        <button
          onClick={() => setFilter("month")}
          className={`py-1 px-3 rounded-md ${
            filter === "month"
              ? "bg-rose-500 text-white"
              : "bg-rose-200 text-rose-700"
          } hover:bg-rose-400`}
        >
          Mês
        </button>
        <button
          onClick={() => setFilter("all")}
          className={`py-1 px-3 rounded-md ${
            filter === "all"
              ? "bg-rose-500 text-white"
              : "bg-rose-200 text-rose-700"
          } hover:bg-rose-400`}
        >
          Todos
        </button>
      </div>
      {error && (
        <p className="text-sm bg-rose-500 my-4 font-semibold text-center p-2 rounded-md text-rose-200">
          {error}
        </p>
      )}
      {successMessage && (
        <p className="text-sm my-2 font-semibold text-center p-2 rounded-md bg-green-400 text-rose-950">
          {successMessage}
        </p>
      )}

      <ul className="space-y-4">
        {filteredAppointments.map((appt) => (
          <AppointmentCard key={appt.id} appointment={appt} />
        ))}
      </ul>
    </div>
  );
}
