import { Bairro } from "@/types/bairro"
import { api } from "./api"

export async function listarBairros(): Promise<Bairro[]> {
  const response = await api.get('/bairros')
  return response.data
}

export async function criarBairro(data: { nome: string }): Promise<Bairro> {
  const response = await api.post("/bairros", data);
  return response.data;
}

export async function atualizarBairro(
  id: number,
  data: { nome: string }
): Promise<Bairro> {
  const response = await api.put(`/bairros/${id}`, data);
  return response.data;
}

export async function deletarBairro(id: number): Promise<void> {
  await api.delete(`/bairros/${id}`);
}