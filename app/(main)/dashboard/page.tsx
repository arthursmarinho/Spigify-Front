"use client";

import { useEffect, useState } from "react";
import { signOut, User, onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../lib/firebase/firebase";
import { useRouter } from "next/navigation";
import { Button } from "../../components/button";
import SearchMusic from "./Components/page";

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 py-10 px-4">
      <div className="flex justify-between items-center max-w-5xl mx-auto mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-800">Buscar Músicas</h1>
          {user && (
            <p className="text-sm text-gray-700 mt-1">
              Bem-vindo, <br />
              <span className="font-semibold">
                {user.displayName || user.email}
              </span>
            </p>
          )}
        </div>

        <Button onClick={handleLogout}>Logout</Button>
      </div>

      <div className="max-w-5xl mx-auto">
        <SearchMusic />
      </div>
      <div className="w-[320px]">
        <p>
          Caro recrutador, como este site está hospedado em plataformas
          gratuitas, o back-end e o front-end podem entrar em estado de
          "hibernação" caso não sejam acessados com frequência. Portanto, caso a
          pesquisa não funcione de imediato, peço que aguarde alguns instantes
          para que o back-end seja reativado. Desde já, agradeço.
        </p>
      </div>
    </div>
  );
}
