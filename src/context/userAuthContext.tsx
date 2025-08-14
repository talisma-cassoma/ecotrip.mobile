import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../services/superbase'
import { COLECTION_USERS, buildStoredUser } from '../configs/database';
import { router } from 'expo-router';
import { AuthUser } from '../configs/database';

export type UserContextType = {
  setUser: (user: AuthUser | null) => void
  user: AuthUser | null;
  loading: boolean;
};

export const UserAuthContext = createContext({} as UserContextType);

export const UserAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadUserStorageData() {
    try {
      setLoading(true);
      const savedUser = await AsyncStorage.getItem(COLECTION_USERS);

      if (savedUser) {

        const parsed = JSON.parse(savedUser);
        const parsedUser = parsed as AuthUser;
        setUser(parsedUser);
        await AsyncStorage.setItem(COLECTION_USERS, JSON.stringify(parsedUser));

        //console.log("role do user", parsed)
        if (parsedUser.role.type === 'driver') {
          router.replace("./newTripRequests");
        } else {
          router.replace("/home");
        }

      }
    } catch (err) {
      console.error('Erro ao restaurar auth user:', err);
      setUser(null);
      console.warn('Nenhum usuário encontrado no armazenamento local');
      router.replace('/login');
    }
    finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    loadUserStorageData();
  }, []);

  return (
    < UserAuthContext.Provider
      value={{ setUser, user, loading }}
    >
      {children}
    </ UserAuthContext.Provider>
  );
};

export const useUserAuth = () => {
  const context = useContext(UserAuthContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};