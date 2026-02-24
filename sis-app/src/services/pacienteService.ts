import { api } from './api';
import { PacienteResponseDTO } from '@/types/paciente';

export const getPacientes = async (): Promise<PacienteResponseDTO[]> => {
  const { data } = await api.get('/pacientes');
  return data;
};

export async function criarPaciente(data: {
  nome: string;
  cpf: string;
  telefone: string;
  dataNascimento: string;
  sexo: string;
  idEndereco: number;
}) {
  const response = await api.post("/pacientes", data);
  return response.data;
}

export async function atualizarPaciente(
  id: number,
  data: {
    nome: string;
    cpf: string;
    telefone: string;
    dataNascimento: string;
    sexo: string;
    idEndereco: number;
  }
) {
  const response = await api.put(`/pacientes/${id}`, data);
  return response.data;
}

export const deletarPaciente = async (id: number) => {
  try {
    await api.delete(`/pacientes/${id}`);
  } catch (err) {
    console.error("Erro ao deletar paciente", err);
    throw err;
  }
};