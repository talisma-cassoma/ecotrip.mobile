import axios from "axios"
import { io } from 'socket.io-client';

const URL =  'http://192.168.11.104:3000'; //process.env.EXPO_PRIVATE_API_URL,

export const api = axios.create({
  baseURL: URL, 
  timeout: 700,
})

export const socket = io(URL, {
  autoConnect: false
});