import { Bairro } from "@/types/bairro"
import { api } from "./api"

export async function listarBairros(): Promise<Bairro[]> {
  const response = await api.get('/bairros')
  return response.data
}