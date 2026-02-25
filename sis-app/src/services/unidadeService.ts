import { api } from "./api";
import {
  UnidadeRequestDTO,
  UnidadeResponseDTO,
} from "@/types/unidade";

export async function listarUnidades(): Promise<UnidadeResponseDTO[]> {
  const response = await api.get("/unidades");
  return response.data;
}

export async function buscarUnidadePorId(
  id: number
): Promise<UnidadeResponseDTO> {
  const response = await api.get(`/unidades/${id}`);
  return response.data;
}

export async function criarUnidade(
  data: UnidadeRequestDTO
): Promise<UnidadeResponseDTO> {
  const response = await api.post("/unidades", data);
  return response.data;
}

export async function atualizarUnidade(
  id: number,
  data: UnidadeRequestDTO
): Promise<UnidadeResponseDTO> {
  const response = await api.put(`/unidades/${id}`, data);
  return response.data;
}

export async function deletarUnidade(id: number): Promise<void> {
  await api.delete(`/unidades/${id}`);
}