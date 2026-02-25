import { api } from "./api";
import {
  AplicacaoVacinaRequestDTO,
  AplicacaoVacinaResponseDTO,
} from "@/types/aplicacaoVacina";

export async function listarAplicacoesVacina(): Promise<
  AplicacaoVacinaResponseDTO[]
> {
  const response = await api.get("/aplicacoes-vacina");
  return response.data;
}

export async function buscarAplicacaoVacinaPorId(
  id: number
): Promise<AplicacaoVacinaResponseDTO> {
  const response = await api.get(`/aplicacoes-vacina/${id}`);
  return response.data;
}

export async function criarAplicacaoVacina(
  data: AplicacaoVacinaRequestDTO
): Promise<AplicacaoVacinaResponseDTO> {
  const response = await api.post("/aplicacoes-vacina", data);
  return response.data;
}

export async function atualizarAplicacaoVacina(
  id: number,
  data: AplicacaoVacinaRequestDTO
): Promise<AplicacaoVacinaResponseDTO> {
  const response = await api.put(`/aplicacoes-vacina/${id}`, data);
  return response.data;
}

export async function deletarAplicacaoVacina(
  id: number
): Promise<void> {
  await api.delete(`/aplicacoes-vacina/${id}`);
}