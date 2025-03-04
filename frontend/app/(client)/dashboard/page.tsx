"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/providers/authProvider";
import ScheduleForm from "@/components/appointments/AppointmentForm";
import AppointmentsList from "@/components/appointments/AppointmentsList";
import { redirect } from "next/navigation";
import {  Dancing_Script } from "next/font/google";
const dancingScript = Dancing_Script({subsets:['latin'], weight:["400","700"]})


export default function ClientDashboard() {
  const { user, logout } = useAuth();
  const [view, setView] = useState<'schedule' | 'appointments'>('schedule');

   useEffect(()=>{
     if (!user){
       redirect('/')
     }else if(user.role !== "client"){
       redirect('/admin/dashboard')
     }
  },[user])

  return (
    <div className="min-h-screen bg-rose-50">
      <nav className="bg-gradient-to-r from-pink-300 to-purple-400 p-4 flex justify-between items-center">
        <div className="text-rose-900 text-lg font-bold">Bem-vinda, {user?.name || user?.email}</div>
        <h1 className={`text-4xl  md:text-5xl font-bold ${dancingScript.className}  text-rose-950`}>Salão da Leila</h1>
        <button
          onClick={logout}
          className="py-2 px-6 bg-rose-950 text-white rounded-md hover:bg-pink-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
        >
          Sair
        </button>
      </nav>
      <main className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-rose-700 mb-6">Meu Painel</h1>
        <div className="mb-6 flex space-x-4">
          <button
            onClick={() => setView('schedule')}
            className={`py-2 px-4 rounded-md ${view === 'schedule' ? 'bg-rose-950 text-white' : 'bg-rose-200 text-rose-700'} hover:bg-rose-800 hover:text-pink-50`}
          >
            Agendar Novo Serviço
          </button>
          <button
            onClick={() => setView('appointments')}
            className={`py-2 px-4 rounded-md ${view === 'appointments' ? 'bg-rose-950 text-white' : 'bg-pink-200 text-pink-700'} hover:bg-rose-800 hover:text-pink-50`}
          >
            Meus Agendamentos
          </button>
        </div>

        {view === 'schedule' ? (
          <ScheduleForm  onSwitchView={() => setView('appointments')} />
        ) : (
          <AppointmentsList />
        )}
      </main>
    </div>
  );
}