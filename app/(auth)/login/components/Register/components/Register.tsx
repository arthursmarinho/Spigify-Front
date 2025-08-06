"use client";

import { Button } from "../../../../../components/button";
import { Input } from "../../../../../components/input";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { auth, db } from "../../../../../../lib/firebase/firebase";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleRegister = async (e: any) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        username: username,
        email: user.email,
      });
      toast("Conta criada com sucesso");
      router.push("/login");
    } catch (error) {
      toast("Erro ao criar conta");
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-sm flex flex-col gap-4"
      >
        <h2 className="text-2xl font-semibold text-center mb-2">Criar Conta</h2>
        <Input
          placeholder="Digite seu nome de usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Digite sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" className="w-full cursor-pointer">
          Criar conta
        </Button>
        <div className="flex flex-row w-full">
          <Link href="login">
            <h1 className="text-blue-400">Já tem uma conta? Faça login aqui</h1>
          </Link>
        </div>
      </form>
    </div>
  );
}
