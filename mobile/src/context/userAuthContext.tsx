import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../services/superbase'
import { COLECTION_USERS } from '../configs/database';
import { router } from 'expo-router';

type UserRole = 'driver' | 'passenger';

export interface UserData{
  id?: string;
  role?: UserRole;
  rating?: number;
  car?: {
    model: string;
    plate: string
  }
  name: string;
  email: string;
  access_token: string;
  refresh_token: string;
};

export type UserContextType = {
  user: UserData | null;
  verifyingAuth: boolean;
};

export const  UserAuthContext = createContext({} as UserContextType);

export const UserAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [verifyingAuth, setLoading] = useState(true);

  useEffect(() => {
  const restoreSession = async () => {
    try {
      const sessionString = await AsyncStorage.getItem(COLECTION_USERS);
      if (sessionString) {
        const savedUser = JSON.parse(sessionString);
        const { error } = await supabase.auth.setSession({
          access_token: savedUser.access_token,
          refresh_token: savedUser.refresh_token,
        });
        if (error) {
          console.warn('Sessão inválida:', error.message);
          await AsyncStorage.removeItem(COLECTION_USERS);
        }
      }
    } catch (e) {
      console.error('Erro ao restaurar sessão:', e);
    } finally {
      setLoading(false);
    }
  };

  restoreSession();

  const { data: authListener } = supabase.auth.onAuthStateChange(
    async (event, session) => {
      if (session) {

        const { user:supaUser} = session

        const authUser: UserData = {
          name: supaUser.user_metadata.full_name || '',
          email: supaUser.email || '',
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        };

        setUser(authUser);
        await AsyncStorage.setItem(COLECTION_USERS, JSON.stringify(authUser));
        router.replace('/home');
      } else {
        setUser(null);
        await AsyncStorage.removeItem(COLECTION_USERS);
        router.replace('/login');
      }
    }
  );

  return () => {
    authListener.subscription.unsubscribe();
  };
}, []);



  return (
    < UserAuthContext.Provider
      value={{ user, verifyingAuth }}
    >
      {children}
    </ UserAuthContext.Provider>
  );
};

export const useUserAuth = () => {
  const context = useContext( UserAuthContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
