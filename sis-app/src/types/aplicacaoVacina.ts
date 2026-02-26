export interface AplicacaoVacinaRequestDTO {
  dataAplicacao: string; // ISO string (ex: 2026-02-25T14:00:00)
  dose: string;
  pacienteId: number;
  vacinaId: number;
  enfermeiroId: number;
  unidadeId: number;
}

export interface AplicacaoVacinaResponseDTO {
  id: number;
  dataAplicacao: string;
  dose: string;
  nomePaciente: string;
  nomeVacina: string;
  nomeEnfermeiro: string;
  nomeUnidade: string;
}