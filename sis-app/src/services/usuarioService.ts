import { api } from "./api";
import { UsuarioRequestDTO, UsuarioResponseDTO, UsuarioUpdateDTO } from "@/types/usuario";

export async function listarUsuarios(): Promise<UsuarioResponseDTO[]> {
  const response = await api.get("/usuarios");
  return response.data;
}

export async function buscarUsuarioPorId(id: number): Promise<UsuarioResponseDTO> {
  const response = await api.get(`/usuarios/${id}`);
  return response.data;
}

export async function criarUsuario(data: UsuarioRequestDTO): Promise<UsuarioResponseDTO> {
  const response = await api.post("/usuarios", data);
  return response.data;
}

export async function atualizarUsuario(
  id: number,
  data: UsuarioUpdateDTO
): Promise<UsuarioResponseDTO> {
  const response = await api.put(`/usuarios/${id}`, data);
  return response.data;
}

export async function deletarUsuario(id: number): Promise<void> {
  await api.delete(`/usuarios/${id}`);
}