import { api } from "./api";
import {
  AgenteSaudeRequestDTO,
  AgenteSaudeResponseDTO,
} from "@/types/agente";

export async function listarAgentesSaude(): Promise<
  AgenteSaudeResponseDTO[]
> {
  const response = await api.get("/agentes");
  return response.data;
}

export async function criarAgenteSaude(
  data: AgenteSaudeRequestDTO
): Promise<AgenteSaudeResponseDTO> {
  const response = await api.post("/agentes", data);
  return response.data;
}

export async function atualizarAgenteSaude(
  id: number,
  data: AgenteSaudeRequestDTO
): Promise<AgenteSaudeResponseDTO> {
  const response = await api.put(`/agentes/${id}`, data);
  return response.data;
}

export async function deletarAgenteSaude(id: number): Promise<void> {
  await api.delete(`/agentes/${id}`);
}