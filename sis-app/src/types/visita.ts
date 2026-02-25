export interface VisitaRequestDTO {
  dataVisita: string; 
  observacoes: string;
  pacienteId: number;
  agenteId: number;
}

export interface VisitaResponseDTO {
  id: number;
  dataVisita: string;
  horarioVisita: string;
  observacoes: string;
  nomePaciente: string;
  nomeAgente: string;
}