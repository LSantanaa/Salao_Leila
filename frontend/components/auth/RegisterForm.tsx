"use client";
import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function RegisterForm({ toggleForm }: { toggleForm: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form className="space-y-4">
      <Input
        type="text"
        label="Nome"
        placeholder="Digite seu nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Input
        type="email"
        label="E-mail"
        placeholder="Digite seu e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        label="Senha"
        placeholder="Crie uma senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
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
