import { api } from "./api";
import {
  VisitaRequestDTO,
  VisitaResponseDTO,
} from "@/types/visita";

export async function listarVisitas(): Promise<VisitaResponseDTO[]> {
  const response = await api.get("/visitas");
  return response.data;
}


export async function criarVisita(
  visita: VisitaRequestDTO
): Promise<VisitaResponseDTO> {
  const response = await api.post("/visitas", visita);
  return response.data;
}

export async function atualizarVisita(
  id: number,
  visita: VisitaRequestDTO
): Promise<VisitaResponseDTO> {
  const response = await api.put(`/visitas/${id}`, visita);
  return response.data;
}

export async function deletarVisita(id: number): Promise<void> {
  await api.delete(`/visitas/${id}`);
}