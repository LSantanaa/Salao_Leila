"use client";
import {  useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useAuth } from "@/providers/authProvider";


export default function LoginForm({ toggleForm }: { toggleForm: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
    } catch (error) {
      setError((error as Error).message);
      console.error("Erro ao fazer login: ", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="email"
        label="E-mail"
        required
        placeholder="Digite seu e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        label="Senha"
        required
        placeholder="Digite sua senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && (
        <p className="text-sm my-2 text-red-600">{error}</p> // Exibe o erro abaixo dos campos
      )}
      <Button text="Entrar" type="submit" />
      <p className="text-center text-sm text-gray-600">
        Não tem uma conta?{" "}
        <button
          onClick={toggleForm}
          className="text-pink-500 font-semibold hover:underline"
        >
          Cadastre-se
        </button>
      </p>
    </form>
  );
}
