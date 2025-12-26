
export enum GameType {
  MEGA_SENA = 'mega_sena',
  LOTOFACIL = 'lotofacil',
  QUINA = 'quina',
  MILIONARIA = 'milionaria',
  DUPLA_SENA = 'dupla_sena',
  DIA_DE_SORTE = 'dia_de_sorte',
  TIMEMANIA = 'timemania'
}

export enum StrategyObjective {
  QUADRA = 'quadra',
  QUINA = 'quina',
  BALANCED = 'balanced'
}

export interface BetFilters {
  oddRange: [number, number];
  sumRange: [number, number];
  maxConsecutive: number;
  minBuckets: number;
  avoidAllLe31: boolean;
}

export interface PortfolioConfig {
  gameType: GameType;
  budget: number | null;
  numGames: number;
  pool: number[];
  objective: StrategyObjective;
  filters: BetFilters;
  candidatesN: number;
  seed?: string;
}

export interface PortfolioStats {
  candidatesGenerated: number;
  candidatesAccepted: number;
  quadraCoverage: number;
  quinaCoverage: number;
  totalCost: number;
}

export interface GeneratedPortfolio {
  games: number[][];
  stats: PortfolioStats;
}
