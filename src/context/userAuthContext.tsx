import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLECTION_USERS } from '../configs/database';
import { router } from 'expo-router';
import { AuthUser } from '../configs/database';
import { api } from '../services/api'; // aqui entra seu axios/fetch configurado

export type UserContextType = {
  setUser: (user: AuthUser | null) => void
  user: AuthUser | null;
  loading: boolean;
  serverIsOn: boolean;
  serverMessage: string; // 👈 mensagem dinâmica
};

export const UserAuthContext = createContext({} as UserContextType);

export const UserAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [serverIsOn, setServerIsOn] = useState(false);
  const [serverMessage, setServerMessage] = useState("verificando servidor... 🚨");

  async function checkServer(): Promise<boolean> {
    const start = Date.now();
    while (true) {
      try {
        const response = await api.get("/ping");
        if (response.data?.message === "pong") {
          setServerIsOn(true);
          const elapsed = Math.round((Date.now() - start) / 1000); // em segundos
          setServerMessage(`✅ Servidor ligado! Levou ${elapsed} segundos para acordar`);
          return true; // sai do loop
        }
      } catch (error) {
        console.log(`${error} : Server not responding. Retrying in 2 seconds...`);
        setServerMessage("⚠️ Tentando novamente...");
      }
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  async function loadUserStorageData() {
    try {
      setLoading(true);

      router.replace("/connectToServerScreen");

      await checkServer();

      // espera 2 segundos antes de seguir adiante
      await new Promise(resolve => setTimeout(resolve, 2000));

      const savedUser = await AsyncStorage.getItem(COLECTION_USERS);

      if (savedUser) {
        const parsedUser = JSON.parse(savedUser) as AuthUser;
        setUser(parsedUser);
        await AsyncStorage.setItem(COLECTION_USERS, JSON.stringify(parsedUser));

        if (parsedUser.role.type === 'driver') {
          router.replace("/newTripRequests");
        } else {
          router.replace("/home");
        }
      } else {
        router.replace('/login');
      }

    } catch (err) {
      console.error('Erro ao restaurar auth user:', err);
      setUser(null);
      router.replace('/login');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUserStorageData();
  }, []);

  return (
    <UserAuthContext.Provider
      value={{ setUser, user, loading, serverIsOn, serverMessage }}
    >
      {children}
    </UserAuthContext.Provider>
  );
};

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
