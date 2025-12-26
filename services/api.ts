
import { GameType } from '../types';

const API_BASE_URL = 'https://loteriascaixa-api.herokuapp.com/api';

export interface LotteryResult {
  loteria: string;
  concurso: number;
  data: string;
  dezenas: string[];
  premiacoes: {
    descricao: string;
    faixa: number;
    ganhadores: number;
    valor_pago: number;
  }[];
  proximo_concurso: number;
  data_proximo_concurso: string;
  valor_estimado_proximo_concurso: number;
}

const GAME_MAPPING: Record<GameType, string> = {
  [GameType.MEGA_SENA]: 'megasena',
  [GameType.LOTOFACIL]: 'lotofacil',
  [GameType.QUINA]: 'quina',
  [GameType.MILIONARIA]: 'maismilionaria',
  [GameType.DUPLA_SENA]: 'duplasena',
  [GameType.DIA_DE_SORTE]: 'diadesorte',
  [GameType.TIMEMANIA]: 'timemania'
};

export const fetchLatestResult = async (gameType: GameType): Promise<LotteryResult | null> => {
  try {
    const endpoint = GAME_MAPPING[gameType];
    const response = await fetch(`${API_BASE_URL}/${endpoint}/latest`);
    if (!response.ok) throw new Error('Falha ao buscar dados da API');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar resultado:', error);
    return null;
  }
};
