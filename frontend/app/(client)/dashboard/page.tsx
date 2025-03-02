'use client';
import { useAuth } from '@/providers/authProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== 'client') {
      router.push('/admin/dashboard');
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 p-4 flex justify-between items-center">
        <div className="text-white text-lg">Bem-vindo, {user.name}</div>
        <button
          onClick={logout}
          className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Sair
        </button>
      </nav>
      <main className="p-6">
        <h1 className="text-2xl font-bold">Dashboard Cliente</h1>
        {/* Conteúdo do dashboard aqui */}
      </main>
    </div>
  );
}