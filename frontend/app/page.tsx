"use client";
import {  useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

import {  Dancing_Script, Montserrat } from "next/font/google";
const dancingScript = Dancing_Script({subsets:['latin'], weight:["400","700"]})
const montserrat = Montserrat({subsets:['latin'], weight:["400","700"]})

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)


  return (
    <main className={`${montserrat.className} flex flex-col items-center text-center justify-center min-h-screen bg-gradient-to-r from-pink-300 to-purple-400 p-4`}>
      <h1 className={`text-4xl  md:text-5xl font-bold ${dancingScript.className}  text-rose-950`}>Bem Vindo ao Salão da Leila</h1>
      <p className="m-4 text-2xl text-rose-900">Faça login para continuar</p>
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-2xl">
        <h2 className="text-2xl font-semibold text-center text-pink-800 mb-4">
          {isLogin ? "Entrar" : "Criar Conta"}
        </h2>
        {isLogin ? (
          <LoginForm toggleForm={() => setIsLogin(false)} />
        ) : (
          <RegisterForm toggleForm={() => setIsLogin(true)} />
        )}
      </div>
    </main>
  );
}
