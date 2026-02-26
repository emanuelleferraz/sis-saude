// src/types/consulta.ts

export interface ConsultaRequestDTO {
  dataConsulta: string; // ISO string
  observacoes: string;

  pacienteId: number;
  medicoId: number;
  unidadeId: number;
  doencaId: number;
}

export interface ConsultaResponseDTO {
  id: number;
  dataConsulta: string; // ISO string
  observacoes: string;

  pacienteNome: string;
  medicoNome: string;
  unidadeNome: string;
  doencaNome: string;
}