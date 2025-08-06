"use client";

import { doSignInWithGoogle } from "../../../../../../lib/firebase/auth";
import { useAuth } from "../../../../../contexts/authContext";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, User, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../../../../lib/firebase/firebase";
import { Input } from "../../../../../components/input";
import { Button } from "../../../../../components/button";
import { Eye, EyeOff } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "sonner";
import Link from "next/link";

export default function LoginPage() {
  const authContext = useAuth();
  const userLoggedIn = authContext?.userLoggedIn;
  const router = useRouter();

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [userEmail, setUserEmail] = useState<string | "">("");
  const [userPassword, setUserPassword] = useState<string | "">("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [loading, user, router]);

  const onGoogleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      doSignInWithGoogle()
        .then(() => {
          router.push("/dashboard");
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsSigningIn(false);
        });
    }
  };

  async function login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("Usuário logado:", user.email);
    } catch (error: any) {
      console.error("Erro ao fazer login:", error.code, error.message);
    }
  }

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        userEmail,
        userPassword
      );
      const user = userCredential.user;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
    } catch (error) {
      toast("Email ou senha inválidos.");
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-black">
      <div className="absolute inset-0 bg-black bg-opacity-70" />

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md text-white space-y-6">
          <h1 className="text-3xl font-bold text-center">Bem-vindo!</h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="Digite seu email..."
            />

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
                placeholder="Digite sua senha..."
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <Button type="submit" className="w-full">
              Fazer login
            </Button>
          </form>

          <p className="text-center text-sm text-gray-300">
            Ou entre com sua conta Google
          </p>

          <button
            onClick={onGoogleSignIn}
            className="flex items-center justify-center gap-3 w-full bg-white text-black py-2 rounded-lg shadow-md hover:bg-gray-100 transition"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
              alt="Google logo"
              className="w-5 h-5"
            />
            Entrar com Google
          </button>

          <div className="text-center">
            <Link href="/login/components/Register">
              <span className="text-sm text-blue-500 hover:underline">
                Não tem conta? Crie aqui
              </span>
            </Link>
          </div>

          <div className="mt-6 bg-gray-800 bg-opacity-60 p-6 rounded-xl text-sm space-y-2 text-center">
            <h2 className="font-semibold text-white">Conta fictícia</h2>
            <p>Email: usuario@spigify.com</p>
            <p>Senha: 123456</p>
          </div>
        </div>
      </div>
    </div>
  );
}
