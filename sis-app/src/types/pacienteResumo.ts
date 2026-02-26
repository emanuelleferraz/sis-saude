// types/pacienteResumo.ts
export interface ConsultaResumoDTO {
  id: number;
  dataConsulta: string;
  horarioConsulta: string;
  medicoNome: string;
  doencaNome: string;
  unidadeNome: string;
  observacoes?: string;
}

export interface VacinaResumoDTO {
  id: number;
  nomeVacina: string;
  dose: number;
  nomeEnfermeiro: string;
  dataAplicacao: string;
  nomeUnidade: string;
}

export interface VisitaResumoDTO {
  id: number;
  nomeAgente: string;
  dataVisita: string;
  horarioVisita: string;
  observacoes?: string;
}

export type EnumSexoPaciente = "MASCULINO" | "FEMININO" | "OUTRO";

export interface PacienteResumoDTO {
  id: number;
  nome: string;
  cpf: string;
  dataNascimento: string;
  sexo: EnumSexoPaciente;
  telefone?: string;
  enderecoFormatado: string;
  consultas: ConsultaResumoDTO[];
  vacinas: VacinaResumoDTO[];
  visitas: VisitaResumoDTO[];
}