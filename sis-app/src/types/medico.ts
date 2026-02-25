export interface MedicoRequestDTO {
  nome: string;
  crm: string;
  especialidade: string;
  unidadeId: number;
}

export interface MedicoResponseDTO {
  id: number;
  nome: string;
  crm: string;
  especialidade: string;
  nomeUnidade: string;
}