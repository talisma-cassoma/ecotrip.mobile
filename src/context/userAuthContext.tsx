import React, { createContext, useEffect, useState } from "react";
import { useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthUser } from "@/types";
import { COLLECTION_USERS, storeUser } from "@/configs/database";
import { useAuth, useUser } from "@clerk/clerk-expo";

interface AuthContextProps {
  user: AuthUser | null;
  setUser: React.Dispatch<React.SetStateAction<AuthUser | null>>;
  isLoggedIn: boolean;
  isLoaded: boolean;
  login: (user: AuthUser) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const { signOut } = useAuth();
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();

  const isLoggedIn = !!user;

  // 🔥 Bootstrapping — hydrate session FIRST, only then isLoaded = true
useEffect(() => {
  let mounted = true;

  const hydrate = async () => {
    try {
      // 1️⃣ Primeiro: tenta carregar do storage
      const saved = await AsyncStorage.getItem(COLLECTION_USERS);
      console.log("saved user: ", saved)

      if (saved && mounted) {
        setUser(JSON.parse(saved));
        
      }

      // 2️⃣ Depois: espera Clerk
      if (!clerkLoaded) return;

      // 3️⃣ Se houver Clerk user → sobrescreve
      if (clerkUser && mounted) {
        const newUser: AuthUser = {
          name: clerkUser.fullName ?? "",
          email: clerkUser.primaryEmailAddress?.emailAddress ?? "",
          image: clerkUser.imageUrl,
          telephone: "",
          role: { type: "passenger" },
        };

        setUser(newUser);
        //await storeUser(newUser); // 🔥 sincroniza com storage
      }

      // 4️⃣ Se NÃO houver Clerk → mantém ou limpa
      if (!clerkUser && mounted && !saved) {
        setUser(null);
      }

    } catch (e) {
      console.error("Auth hydrate failed", e);
      setUser(null);
    } finally {
      if (mounted) setIsLoaded(true);
    }
  };

  hydrate();

  return () => {
    mounted = false;
  };
}, [clerkUser, clerkLoaded]);
  // 🔐 Login
  const login = async (userData: AuthUser) => {
    setUser(userData);
    await storeUser(userData);
  };


  // 🚪 Logout
  const logout = async () => {
    await AsyncStorage.removeItem(COLLECTION_USERS);
    await signOut(); // limpa token, sessão e storage local do Clerk
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user,setUser, isLoggedIn, isLoaded, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useUserAuth = () => {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useUserAuth must be used inside AuthProvider");
  }

  return ctx; // ❗ não crie user, isLoaded, isLoggedIn novamente aqui
};