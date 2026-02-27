export interface AplicacaoPorUnidadeDTO {
  unidade: string;
  vacina: string;
  totalAplicacoes: number;
}

export interface CardResumoVacinaDTO {
  pessoasVacinadas: number;
  dosesAplicadas: number;
  vacinaMaisAplicada: string;
  bairroMenorCobertura: string;
}

export interface CoberturaVacinalBairroDTO {
  bairro: string;
  totalAplicacoes: number;
}

export interface DistribuicaoVacinaDTO {
  nomeVacina: string;
  totalAplicacoes: number;
}

export interface EvolucaoDosesTrimestreDTO {
  ano: number;
  trimestre: number;
  totalDoses: number;
}

export interface DashboardVacinaDTO {
  resumo: CardResumoVacinaDTO;
  distribuicaoVacinas: DistribuicaoVacinaDTO[];
  evolucaoTrimestral: EvolucaoDosesTrimestreDTO[];
  coberturaPorBairro: CoberturaVacinalBairroDTO[];
  aplicacoesPorUnidade: AplicacaoPorUnidadeDTO[];
}