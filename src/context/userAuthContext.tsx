import React, { createContext, useContext, useEffect, useState } from "react";
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

const updateUser = async (
  newUser: AuthUser | null,
  options: { save?: boolean } = { save: true }
) => {
  if (!options.save) {
    // Apenas carregar do storage
    setUser(newUser);
    return;
  }

  try {
    if (newUser) {
      // Validar tokens
      if (!newUser.access_token || !newUser.refresh_token) {
        console.warn("updateUser: tokens ausentes");
        setUser(null);
        return;
      }

      // Salvar no AsyncStorage
      if (newUser.role.type === "driver") {
        if (!newUser.role.data) {
          console.warn("updateUser: driverData ausente");
          setUser(null);
          return;
        }

        await storeUser({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          image: newUser.image,
          access_token: newUser.access_token,
          refresh_token: newUser.refresh_token,
          telephone: newUser.telephone,
          role: "driver",
          driverData: newUser.role.data,
        });
      } else {
        await storeUser({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          image: newUser.image,
          access_token: newUser.access_token,
          refresh_token: newUser.refresh_token,
          role: "passenger",
        });
      }

      console.log("✅ Usuário salvo com sucesso:", newUser.email);
      
      // ✅ ATUALIZAR O ESTADO APÓS PERSISTÊNCIA SUCEDER
      setUser(newUser);
      
    } else {
      await AsyncStorage.removeItem(COLLECTION_USERS);
      console.log("✅ Usuário removido do armazenamento");
      setUser(null);
    }
  } catch (err) {
    console.error("❌ Erro ao salvar/remover usuário:", err);
    setUser(null);
    throw err;
  }
};

  /**
   * ======================================================
   * 🚀 Carregar usuário salvo ao iniciar o app
   * ======================================================
   */
  useEffect(() => {
    const loadUser = async () => {
      try {
        const saved = await AsyncStorage.getItem(COLLECTION_USERS);
        if (saved) {
          const parsed = JSON.parse(saved) as AuthUser;
          await updateUser(parsed, { save: false });
        }
      } catch (err) {
        console.error("Erro ao carregar usuário:", err);
      } finally {
        setIsLoaded(true);
      }
    };

    loadUser();
  }, []);

  /**
   * ======================================================
   * 🔐 Login
   * ======================================================
   */
  const login = async (userData: AuthUser) => {
    await updateUser(userData, { save: true });
  };

  /**
   * ======================================================
   * 🚪 Logout
   * ======================================================
   */
  const logout = async () => {
    await updateUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoggedIn,
        isLoaded,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
