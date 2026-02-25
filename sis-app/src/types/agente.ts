export interface AgenteSaudeRequestDTO {
  nome: string;
  telefone: string;
  unidadeId: number;
  bairroId: number;
}

export interface AgenteSaudeResponseDTO {
  id: number;
  nome: string;
  telefone: string;
  nomeUnidade: string;
  nomeBairro: string;
}