
import { GameType } from './types';

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
    maxPool: 22,
    defaultSumRange: [170, 220],
    defaultOddRange: [7, 9]
  },
  [GameType.QUINA]: {
    name: 'Quina',
    maxNum: 80,
    pickSize: 5,
    cost: 2.5,
    minPool: 5,
    maxPool: 20,
    defaultSumRange: [160, 240],
    defaultOddRange: [2, 3]
  },
  [GameType.MILIONARIA]: {
    name: '+Milionária',
    maxNum: 50,
    pickSize: 6,
    cost: 6.0,
    minPool: 6,
    maxPool: 18,
    defaultSumRange: [120, 180],
    defaultOddRange: [2, 4]
  },
  [GameType.DUPLA_SENA]: {
    name: 'Dupla Sena',
    maxNum: 50,
    pickSize: 6,
    cost: 2.5,
    minPool: 6,
    maxPool: 20,
    defaultSumRange: [120, 180],
    defaultOddRange: [2, 4]
  },
  [GameType.DIA_DE_SORTE]: {
    name: 'Dia de Sorte',
    maxNum: 31,
    pickSize: 7,
    cost: 2.5,
    minPool: 7,
    maxPool: 20,
    defaultSumRange: [90, 130],
    defaultOddRange: [3, 4]
  },
  [GameType.TIMEMANIA]: {
    name: 'Timemania',
    maxNum: 80,
    pickSize: 10,
    cost: 3.5,
    minPool: 10,
    maxPool: 22,
    defaultSumRange: [350, 450],
    defaultOddRange: [4, 6]
  }
};

export const GAME_CONSTANTS = {
  MAX_CANDIDATES: 100000,
  DEFAULT_CANDIDATES_N: 20000,
  LAST_PRICE_UPDATE: "Fevereiro 2025"
};

export const DEFAULT_FILTERS = {
  maxConsecutive: 2,
  minBuckets: 2,
  avoidAllLe31: false
};

export const GUARDRAIL_MESSAGES = [
  "Esta ferramenta NÃO prevê resultados futuros. Sorteios são eventos aleatórios independentes.",
  "O uso de coberturas matemáticas NÃO garante prêmios. O objetivo é a eficiência combinatória.",
  "Este software é exclusivamente para fins educacionais e de organização estratégica.",
  "Sempre verifique o preço atual na sua lotérica. Os valores aqui são sugestões baseadas na última atualização oficial."
];
