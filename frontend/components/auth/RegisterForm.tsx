"use client";
import { useState } from "react";
import Input from "../formComponents/Input";
import Button from "../formComponents/Button";
import { useAuth } from "@/providers/authProvider";

export default function RegisterForm({ toggleForm }: { toggleForm: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

   const [error, setError] = useState<string | null>(null);
    const {register} = useAuth();
  
    const handleSubmit = async(e:React.FormEvent)=>{
      e.preventDefault();
      setError(null)
      try {
        await register(name,email, password)
      } catch (error) {
        setError((error as Error).message)
        console.error("Erro ao fazer registro: ",error)
      }
    }
    

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input
        type="text"
        label="Nome"
        placeholder="Digite seu nome"
        value={name}
        required
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        type="email"
        label="E-mail"
        placeholder="Digite seu e-mail"
        value={email}
        required
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        label="Senha"
        placeholder="Crie uma senha"
        value={password}
        required
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && (
          <p className="text-sm my-2 text-red-600">{error}</p> // Exibe o erro abaixo dos campos
        )}
      <Button text="Cadastrar" type="submit" />
      <p className="text-center text-sm text-gray-600">
        Já tem uma conta?{" "}
        <button onClick={toggleForm} className="text-pink-500 font-semibold hover:underline">
          Faça login
        </button>
      </p>
    </form>
  );
}
