"use client";
import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function LoginForm({ toggleForm }: { toggleForm: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form className="space-y-4">
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
        placeholder="Digite sua senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button text="Entrar" type="submit" />
      <p className="text-center text-sm text-gray-600">
        Não tem uma conta?{" "}
        <button onClick={toggleForm} className="text-pink-500 font-semibold hover:underline">
          Cadastre-se
        </button>
      </p>
    </form>
  );
}
