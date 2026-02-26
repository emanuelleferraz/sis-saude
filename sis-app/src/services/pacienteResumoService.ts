import { PacienteResumoDTO } from "@/types/pacienteResumo";
import { api } from "./api"; 

export async function getPacienteResumo(
  id: number
): Promise<PacienteResumoDTO> {
  const response = await api.get(`/pacientes/${id}/resumo`);
  return response.data;
}