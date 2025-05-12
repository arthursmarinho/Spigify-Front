"use client";

import Image from "next/image";
import {
  doSignInWithGoogle,
  doSignInWithEmailAndPassword,
} from "../../../lib/firebase/auth";
import { useAuth } from "../../contexts/authContext";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, User } from "firebase/auth";

export default function LoginPage() {
  const authContext = useAuth();
  const userLoggedIn = authContext?.userLoggedIn;
  const router = useRouter();

  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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
        .catch(() => {
          setErrorMessage("Erro ao entrar com Google");
        })
        .finally(() => {
          setIsSigningIn(false);
        });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
      <div className="relative">
        <Image
          src="/bg-login.png"
          alt="Login Background"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority
        />
      </div>

      <div className="flex items-center justify-center bg-white">
        <div className="w-full max-w-md p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 pb-12">
            Welcome Back
          </h2>

          <div className="mt-6 text-center ">
            <button
              onClick={onGoogleSignIn}
              className="w-full py-2 px-4 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition"
              disabled={isSigningIn}
            >
              <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
              <span>Login With Google</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
