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
    <div className="min-h-screen bg-[#242734] text-white py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white">Buscar Músicas</h1>
            {user && (
              <p className="text-sm text-gray-400 mt-1">
                Bem-vindo, <br />
                <span className="font-semibold text-[#FFC355]">
                  {user.displayName || user.email}
                </span>
              </p>
            )}
          </div>

          <Button onClick={handleLogout} className="mt-4 sm:mt-0">
            Logout
          </Button>
        </div>

        <div className="bg-[#1a1c26] rounded-2xl p-6 shadow-lg">
          <SearchMusic />
        </div>

        <div className="mt-10 bg-[#1a1c26] text-gray-300 text-sm p-4 rounded-lg max-w-md mx-auto">
          <p>
            Caro recrutador, como este site está hospedado em plataformas
            gratuitas, o back-end e o front-end podem entrar em estado de
            "hibernação" caso não sejam acessados com frequência. Portanto, caso
            a pesquisa não funcione de imediato, peço que aguarde alguns
            instantes para que o back-end seja reativado. Desde já, agradeço.
          </p>
        </div>
      </div>
    </div>
  );
}
