import axios from "axios"

export const api = axios.create({
  baseURL: "http://192.168.11.106:3333",
  timeout: 700,
})
