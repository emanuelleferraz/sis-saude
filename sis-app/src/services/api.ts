// Conexão com a API do backend
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:8080', 
});

// Enviar o token nas reqs
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});