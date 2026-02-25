import { api } from "./api";
import { PerfilResponseDTO } from "@/types/perfil";

export async function listarPerfis(): Promise<PerfilResponseDTO[]> {
  const response = await api.get("/perfis");
  return response.data;
}