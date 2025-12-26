
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

export const STYLE_INFO: Record<LuckyStyle, { label: string, desc: string, belief: string }> = {
  [LuckyStyle.HOT]: {
    label: "Frequentes (Quentes)",
    desc: "Usa os números que mais saíram nos últimos sorteios.",
    belief: "Ideal para quem acredita em 'ondas de sorte' e tendências atuais."
  },
  [LuckyStyle.COLD]: {
    label: "Atrasados (Frios)",
    desc: "Foca em dezenas que não aparecem há muito tempo.",
    belief: "Para quem acredita no 'ciclo das dezenas': uma hora elas têm que sair."
  },
  [LuckyStyle.BALANCED]: {
    label: "Equilibrado (Trevo)",
    desc: "Distribui os números por todo o volante de forma harmônica.",
    belief: "Baseado na estatística de que a maioria dos sorteios é diversificada."
  },
  [LuckyStyle.ANTI_POPULAR]: {
    label: "Prêmio Solo",
    desc: "Evita datas (1-31) e sequências óbvias que todos jogam.",
    belief: "Focado em não dividir o prêmio com ninguém caso você ganhe."
  },
  [LuckyStyle.RANDOM]: {
    label: "Surpresinha Pura",
    desc: "Sorteio 100% aleatório sem qualquer filtro humano.",
    belief: "Para quem confia no destino e na aleatoriedade total da caixa."
  }
};

export const GAME_CONSTANTS = {
  MAX_CANDIDATES: 100000,
  DEFAULT_CANDIDATES_N: 20000,
  LAST_PRICE_UPDATE: "Fevereiro 2025"
};

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
