"use client";

import { doSignInWithGoogle } from "../../../../lib/firebase/auth";
import { useAuth } from "../../../contexts/authContext";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, User } from "firebase/auth";

export default function LoginPage() {
  const authContext = useAuth();
  const userLoggedIn = authContext?.userLoggedIn;
  const router = useRouter();

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

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

  return (
    <div className="relative w-full h-screen">
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-white px-4">
        <h1 className="text-4xl font-bold mb-4">Bem-vindo!</h1>
        <p className="mb-6 text-center max-w-md">
          Faça login com sua conta Google para continuar
        </p>
        <button
          onClick={onGoogleSignIn}
          className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
            alt="Google logo"
            className="w-5 h-5"
          />
          Entrar com Google
        </button>
      </div>
    </div>
  );
}
