import { Endereco } from "@/types/endereco"
import { api } from "./api"

export async function listarEnderecos(): Promise<Endereco[]> {
  const response = await api.get('/enderecos')
  return response.data
}