import { api } from "@/services/api";
import {
  VacinaRequestDTO,
  VacinaResponseDTO,
} from "@/types/vacina";

export async function listarVacinas(): Promise<VacinaResponseDTO[]> {
  const response = await api.get("/vacinas");
  return response.data;
}

export async function criarVacina(
  data: VacinaRequestDTO
): Promise<VacinaResponseDTO> {
  const response = await api.post("/vacinas", data);
  return response.data;
}

export async function atualizarVacina(
  id: number,
  data: VacinaRequestDTO
): Promise<VacinaResponseDTO> {
  const response = await api.put(`/vacinas/${id}`, data);
  return response.data;
}

export async function deletarVacina(id: number): Promise<void> {
  await api.delete(`/vacinas/${id}`);
}