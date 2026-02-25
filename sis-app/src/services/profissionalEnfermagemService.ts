import { api } from "./api";
import {
  ProfissionalEnfermagemRequestDTO,
  ProfissionalEnfermagemResponseDTO,
} from "@/types/profissionalEnfermagem";

export async function listarProfissionaisEnfermagem(): Promise<
  ProfissionalEnfermagemResponseDTO[]
> {
  const response = await api.get("/enfermeiros");
  return response.data;
}

export async function criarProfissionalEnfermagem(
  data: ProfissionalEnfermagemRequestDTO
): Promise<ProfissionalEnfermagemResponseDTO> {
  const response = await api.post("/enfermeiros", data);
  return response.data;
}

export async function atualizarProfissionalEnfermagem(
  id: number,
  data: ProfissionalEnfermagemRequestDTO
): Promise<ProfissionalEnfermagemResponseDTO> {
  const response = await api.put(
    `/enfermeiros/${id}`,
    data
  );
  return response.data;
}

export async function deletarProfissionalEnfermagem(
  id: number
): Promise<void> {
  await api.delete(`/enfermeiros/${id}`);
}