
import { GameType, LuckyStyle, BetFilters } from './types';

export interface GameSpec {
  name: string;
  maxNum: number;
  pickSize: number;
  cost: number;
  minPool: number;
  maxPool: number;
  defaultSumRange: [number, number];
  defaultOddRange: [number, number];
}

// Fixed: Added configurations for all GameType enum members to satisfy Record<GameType, GameSpec>
export const GAME_CONFIGS: Record<GameType, GameSpec> = {
  [GameType.MEGA_SENA]: {
    name: 'Mega-Sena',
    maxNum: 60,
    pickSize: 6,
    cost: 5.0,
    minPool: 6,
    maxPool: 20,
    defaultSumRange: [150, 210],
    defaultOddRange: [2, 4]
  },
  [GameType.LOTOFACIL]: {
    name: 'Lotofácil',
    maxNum: 25,
    pickSize: 15,
    cost: 3.0,
    minPool: 15,
    maxPool: 20,
    defaultSumRange: [160, 230],
    defaultOddRange: [7, 9]
  },
  [GameType.QUINA]: {
    name: 'Quina',
    maxNum: 80,
    pickSize: 5,
    cost: 2.5,
    minPool: 5,
    maxPool: 15,
    defaultSumRange: [150, 250],
    defaultOddRange: [2, 3]
  },
  [GameType.MILIONARIA]: {
    name: '+Milionária',
    maxNum: 50,
    pickSize: 6,
    cost: 6.0,
    minPool: 6,
    maxPool: 15,
    defaultSumRange: [120, 180],
    defaultOddRange: [2, 4]
  },
  [GameType.DUPLA_SENA]: {
    name: 'Dupla Sena',
    maxNum: 50,
    pickSize: 6,
    cost: 2.5,
    minPool: 6,
    maxPool: 15,
    defaultSumRange: [120, 180],
    defaultOddRange: [2, 4]
  },
  [GameType.DIA_DE_SORTE]: {
    name: 'Dia de Sorte',
    maxNum: 31,
    pickSize: 7,
    cost: 2.5,
    minPool: 7,
    maxPool: 15,
    defaultSumRange: [80, 140],
    defaultOddRange: [3, 4]
  },
  [GameType.TIMEMANIA]: {
    name: 'Timemania',
    maxNum: 80,
    pickSize: 10,
    cost: 3.5,
    minPool: 10,
    maxPool: 20,
    defaultSumRange: [350, 450],
    defaultOddRange: [4, 6]
  }
};

export const REAL_PROBABILITIES = {
  [GameType.MEGA_SENA]: {
    sena: '1 em 50.063.860',
    quina: '1 em 154.518',
    quadra: '1 em 2.332'
  }
};

export const STYLE_DESCRIPTIONS: Record<LuckyStyle, string> = {
  [LuckyStyle.HOT]: "Baseado em heurísticas de números que aparecem com frequência em ciclos recentes (Simulação).",
  [LuckyStyle.COLD]: "Focado em dezenas que 'estão devendo', baseando-se na ideia estética de atraso (Simulação).",
  [LuckyStyle.BALANCED]: "Busca um equilíbrio matemático entre pares/ímpares e distribuição no volante.",
  [LuckyStyle.ANTI_POPULAR]: "Evita números comumente escolhidos (datas, sequências óbvias) para evitar divisão de prêmio.",
  [LuckyStyle.RANDOM]: "Gerado de forma puramente aleatória, sem viés ou filtro estético."
};

export const GAME_CONSTANTS = {
  MAX_CANDIDATES: 100000,
  DEFAULT_CANDIDATES_N: 20000,
  LAST_PRICE_UPDATE: "Fevereiro 2025"
};

// Fixed: Added missing oddRange and sumRange properties to satisfy the BetFilters interface
export const DEFAULT_FILTERS: BetFilters = {
  oddRange: [2, 4],
  sumRange: [150, 210],
  maxConsecutive: 2,
  minBuckets: 2,
  avoidAllLe31: true
};

export const GUARDRAIL_MESSAGES = [
  "Isso NÃO é previsão. Filtros e cobertura NÃO garantem prêmio.",
  "Esses palpites seguem heurísticas de estilo educacionais.",
  "A chance de um jogo simples é igual para qualquer combinação de 6 números.",
  "Este software é exclusivamente para fins educacionais e de organização estratégica."
];
