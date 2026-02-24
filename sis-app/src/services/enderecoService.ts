import { EnderecoRequestDTO, EnderecoResponseDTO } from "@/types/endereco"
import { api } from "./api"

export async function listarEnderecos(): Promise<EnderecoResponseDTO[]> {
  const response = await api.get('/enderecos')
  return response.data
}

export async function criarEndereco(data: EnderecoRequestDTO): Promise<EnderecoResponseDTO> {
  const response = await api.post('/enderecos', data);
  return response.data;
}

export async function atualizarEndereco(id: number, data: EnderecoRequestDTO): Promise<EnderecoResponseDTO> {
  const response = await api.put(`/enderecos/${id}`, data);
  return response.data;
}

export async function deletarEndereco(id: number): Promise<void> {
  await api.delete(`/enderecos/${id}`);
}