import { api } from "./api";
import {
  DoencaRequestDTO,
  DoencaResponseDTO,
} from "@/types/doenca";

export async function listarDoencas(): Promise<DoencaResponseDTO[]> {
  const response = await api.get("/doencas");
  return response.data;
}

export async function criarDoenca(
  data: DoencaRequestDTO
): Promise<DoencaResponseDTO> {
  const response = await api.post("/doencas", data);
  return response.data;
}

export async function atualizarDoenca(
  id: number,
  data: DoencaRequestDTO
): Promise<DoencaResponseDTO> {
  const response = await api.put(`/doencas/${id}`, data);
  return response.data;
}

export async function deletarDoenca(id: number): Promise<void> {
  await api.delete(`/doencas/${id}`);
}