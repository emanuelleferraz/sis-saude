export interface AlertaBairroDTO {
  bairro: string;
  doenca: string;
  totalCasos: number;
  nivelAlerta: string;
}

export interface CardResumoDoencaDTO {
  totalCasos: number;
  bairrosMonitorados: number;
  pacientesUnicos: number;
  casosPeriodos: number;
}

export interface DistribuicaoDoencaDTO {
  doenca: string;
  totalCasos: number;
}

export interface IncidenciaPorBairroDTO {
  bairro: string;
  doenca: string;
  totalCasos: number;
}

export interface TendenciaTrimestralDTO {
  ano: number;
  trimestre: number;
  totalCasos: number;
}

export interface DashboardCronicaDTO {
  resumo: CardResumoDoencaDTO;
  distribuicao: DistribuicaoDoencaDTO[];
  incidenciaPorBairro: IncidenciaPorBairroDTO[];
  tendenciaTrimestral: TendenciaTrimestralDTO[];
  alertas: AlertaBairroDTO[];
}

export interface DashboardEpidemiologicaDTO {
  resumo: CardResumoDoencaDTO;
  distribuicao: DistribuicaoDoencaDTO[];
  incidenciaPorBairro: IncidenciaPorBairroDTO[];
  tendenciaTrimestral: TendenciaTrimestralDTO[];
  alertas: AlertaBairroDTO[];
}