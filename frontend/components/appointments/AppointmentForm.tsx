"use client";

import { useState } from "react";
import { useAppointments } from "@/providers/appointmentsProvider";
import Button from "../formComponents/Button";
import Input from "../formComponents/Input";

type AppointmentFormProps = {
  onSwitchView: () => void;
};

export default function AppointmentForm({ onSwitchView }: AppointmentFormProps) {
  const { createAppointment, services, successMessage } = useAppointments();
  const [serviceId, setServiceId] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

 
  const handleSchedule = async (e: React.FormEvent, useSuggestion?:boolean) => {
    e.preventDefault();
    setError(null);
    try {
      const result = await createAppointment(parseInt(serviceId), dateTime, useSuggestion);
      if (!result.data.success && result.data.suggestion) {
        setSuggestion(result.data.suggestion as string);
        setShowModal(true);
      } else if(result.success){
        setServiceId('');
        setDateTime('');
        setShowModal(false);
        setTimeout(()=>{
          onSwitchView();
        },3500)
      }
    } catch (error) {
      setError((error as Error).message);
    }
  };

  const handleModalChoice = (choice: 'confirm' | 'keep' | 'cancel') => {
    if (choice === 'confirm') {
      handleSchedule({ preventDefault: () => {} } as React.FormEvent, true);
    } else if (choice === 'keep') {
      handleSchedule({ preventDefault: () => {} } as React.FormEvent, false);
    } else {
      setShowModal(false);
    }
  };

  return (
    <div className="">
      <h2 className="text-xl font-bold text-rose-700 mb-4">Agendar Novo Serviço</h2>
      <form onSubmit={handleSchedule} className="space-y-4">
        <div>
          <label htmlFor="service" className="block text-sm font-medium text-gray-700">Serviço</label>
          <select
            required
            id="service"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            <option value="">Selecione um serviço</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>{s.name} - R$ {s.price}</option>
            ))}
          </select>
        </div>
        <div>
           <Input
            label="Data"
            required
            id="date"
            type="date"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
          />
        </div>
        {error && <p className="text-sm bg-rose-500 mt-2 font-semibold text-center p-2 rounded-md text-rose-200">{error}</p>}
        {successMessage && <p className="text-sm mt-2 font-semibold text-center p-2 rounded-md bg-green-400 text-rose-950">{successMessage}</p>}

        <Button
          text="Agendar"
          type="submit"
        />
      </form>

      {showModal && (
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-pink-300/60 to-purple-400/60  flex items-center justify-center">
          <div className="bg-rose-200 p-6 rounded-lg shadow-md max-w-sm w-full">
            <h3 className="text-lg font-bold text-rose-950 mb-4">Sugestão de Agendamento</h3>
            <p className="text-rose-900 mb-4">{suggestion}</p>
            <div className="flex space-x-2">
              <button
                onClick={() => handleModalChoice('confirm')}
                className="py-2 px-4 bg-rose-950 text-rose-200 rounded-md hover:bg-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-400"
              >
                Confirmar
              </button>
              <button
                onClick={() => handleModalChoice('keep')}
                className="py-2 px-4  bg-rose-950 text-rose-200 rounded-md hover:bg-rose-800 focus:outline-none focus:ring-2 focus:ring-pink-400"
              >
                Manter Data
              </button>
              <button
                onClick={() => handleModalChoice('cancel')}
                className="py-2 px-4 bg-gray-300 text-gray-700 border border-rose-300 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Desistir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}