import { api } from "./api";
import {
  MedicoRequestDTO,
  MedicoResponseDTO,
} from "@/types/medico";

export async function listarMedicos(): Promise<MedicoResponseDTO[]> {
  const response = await api.get("/medicos");
  return response.data;
}

export async function criarMedico(
  data: MedicoRequestDTO
): Promise<MedicoResponseDTO> {
  const response = await api.post("/medicos", data);
  return response.data;
}

export async function atualizarMedico(
  id: number,
  data: MedicoRequestDTO
): Promise<MedicoResponseDTO> {
  const response = await api.put(`/medicos/${id}`, data);
  return response.data;
}

export async function deletarMedico(id: number): Promise<void> {
  await api.delete(`/medicos/${id}`);
}