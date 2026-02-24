import { api } from './api';
import { PacienteResponseDTO } from '@/types/paciente';

export const getPacientes = async (): Promise<PacienteResponseDTO[]> => {
  const { data } = await api.get('/pacientes');
  return data;
};