import axios from "axios"

export const api = axios.create({
  baseURL: process.env.EXPO_PRIVATE_API_URL,
  timeout: 700,
})
