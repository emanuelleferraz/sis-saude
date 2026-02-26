import { api } from "./api";
import { ConsultaRequestDTO, ConsultaResponseDTO } from "@/types/consulta";

export async function listarConsultas(): Promise<ConsultaResponseDTO[]> {
  const response = await api.get("/consultas");
  return response.data;
}

export async function buscarConsultaPorId(id: number): Promise<ConsultaResponseDTO> {
  const response = await api.get(`/consultas/${id}`);
  return response.data;
}

export async function criarConsulta(data: ConsultaRequestDTO): Promise<ConsultaResponseDTO> {
  const response = await api.post("/consultas", data);
  return response.data;
}

export async function atualizarConsulta(
  id: number,
  data: ConsultaRequestDTO
): Promise<ConsultaResponseDTO> {
  const response = await api.put(`/consultas/${id}`, data);
  return response.data;
}

export async function deletarConsulta(id: number): Promise<void> {
  await api.delete(`/consultas/${id}`);
}