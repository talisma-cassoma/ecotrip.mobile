import React, { createContext, useEffect, useState } from "react";
import { useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthUser } from "@/types";
import { COLLECTION_USERS, storeUser } from "@/configs/database";

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

  const isLoggedIn = !!user;

  // 🔥 Bootstrapping — hydrate session FIRST, only then isLoaded = true
  useEffect(() => {
    let mounted = true;

    const hydrate = async () => {
      try {
        const saved = await AsyncStorage.getItem(COLLECTION_USERS);

        if (!mounted) return;

        if (saved) {
          const parsed = JSON.parse(saved) as AuthUser;
          setUser(parsed);
        } else {
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
  }, []);

  // 🔐 Login
  const login = async (userData: AuthUser) => {
    await storeUser(userData);
    setUser(userData);
  };

  // 🚪 Logout
  const logout = async () => {
    await AsyncStorage.removeItem(COLLECTION_USERS);
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