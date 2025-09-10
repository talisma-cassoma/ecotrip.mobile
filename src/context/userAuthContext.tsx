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
};

export const UserAuthContext = createContext({} as UserContextType);

export const UserAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [serverIsOn, setServerIsOn] = useState(false);

  async function checkServer(): Promise<boolean> {
  while (true) {
    try {
      const response = await api.get("/ping");
      console.log("Server ping response:", response.data.message);
      if (response.data?.message === "pong") {
        setServerIsOn(true);
        return true; // Retorna para sair do loop
      }
    } catch (error) {
      console.log("Server not responding. Retrying in 2 seconds...");
      // Ignora o erro e continua o loop
    }
    // Espera 5 segundos antes de tentar novamente
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

async function loadUserStorageData() {
  try {
    setLoading(true);

    // Mostra tela de conexão
    router.replace("/connectToServerScreen");

    // Tenta acordar servidor indefinidamente
    await checkServer();

    // Depois que acordar, tenta restaurar usuário
    const savedUser = await AsyncStorage.getItem(COLECTION_USERS);

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser) as AuthUser;
      setUser(parsedUser);
      await AsyncStorage.setItem(COLECTION_USERS, JSON.stringify(parsedUser));

      // Redireciona conforme perfil
      if (parsedUser.role.type === 'driver') {
        router.replace("./newTripRequests");
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
      value={{ setUser, user, loading, serverIsOn }}
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
