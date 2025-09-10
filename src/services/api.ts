import axios from "axios"
import { io } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLECTION_USERS } from '../configs/database';
import { Alert } from "react-native"


const URL = process.env.EXPO_PUBLIC_API_URL;

if (!URL) {
  Alert.alert('Erro: A variável de URL não está definida.');
}

export const api = axios.create({
  baseURL: URL,
  timeout: 9000,
})

export const socket = io(URL, {
  autoConnect: false
});

// Interceptor de requisição: adiciona o access_token
api.interceptors.request.use(async (config) => {
  const excludedRoutes = ['/login', '/passenger/create', '/driver/create', '/refresh', '/ping']; // rotas sem token

  if (!excludedRoutes.some(route => config.url?.includes(route))) {
    const user = await AsyncStorage.getItem(COLECTION_USERS);
    if (user) {
      const parsed = JSON.parse(user);
      config.headers.Authorization = `Bearer ${parsed.access_token}`;
    }
  }

  return config;
});

// Interceptor de resposta: detecta token expirado e tenta renovar
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const savedUser = await AsyncStorage.getItem(COLECTION_USERS);
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        try {
          const refreshRes = await api.post('/refresh', {
            refresh_token: parsedUser.refresh_token,
          });

          const { access_token } = refreshRes.data;
          if (access_token) {
            parsedUser.access_token = access_token;
            await AsyncStorage.setItem(COLECTION_USERS, JSON.stringify(parsedUser));

            originalRequest.headers.Authorization = `Bearer ${access_token}`;
            return api(originalRequest); // reenvia a requisição original
          }
        } catch (err) {
          console.error("Erro ao renovar token automaticamente", err);
          await AsyncStorage.removeItem(COLECTION_USERS);
          return Promise.reject(err);
        }
      }
    }

    return Promise.reject(error);
  }
);
