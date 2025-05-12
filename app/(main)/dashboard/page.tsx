"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import SearchMusic from "../../components/Search/page";
import { doSignOut } from "../../../lib/firebase/auth";
import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { User } from "firebase/auth";
import { Button } from "../../components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../../../src/components/ui/dropdown-menu";
import { useAuth } from "../../contexts/authContext";
import { Car } from "lucide-react";
import CarouselPage from "../../components/carrousel/page";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const router = useRouter();

  const authContext = useAuth();
  const userLoggedIn = authContext?.userLoggedIn;

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  const handleToggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <div>
      <main className="relative min-h-screen w-full">
        <div className="absolute inset-0 -z-10">
          {/* <Image
            src={!darkMode ? "/LightMode.jpg" : "/BlackMode.jpg"}
            alt="Background Image"
            fill
            className="object-cover"
            priority
            quality={100}
          /> */}
        </div>

        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white/10 backdrop-blur-lg rounded-4xl shadow-lg p-20 w-2/3 max-w-4xl">
            <div className="text-white text-center">
              <SearchMusic />
              <CarouselPage />
            </div>
          </div>
        </div>

        <div className="absolute top-6 right-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">⚙️</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-gray-500/40 rounded-4xl">
              <DropdownMenuItem>
                <Button
                  variant="ghost"
                  className="bg-gray-500/40 flex justify-center rounded-4xl"
                  onClick={() => {
                    doSignOut().then(() => {
                      router.push("/login");
                    });
                  }}
                >
                  Logout
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Button
                  variant="ghost"
                  className="bg-gray-500/40 flex justify-center rounded-4xl  hover:bg-gray-500/50"
                  onClick={handleToggleDarkMode}
                >
                  {darkMode ? "Light Mode" : "Dark Mode"}
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="absolute top-20  left-20 text-white">
          {user && (
            <h1 className="text-2xl font-bold">
              <span className="block text-black">Welcome,</span>
              <span className="block text-blue-600">{user.displayName}!</span>
            </h1>
          )}
        </div>
      </main>
    </div>
  );
}
