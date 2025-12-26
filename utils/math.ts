
import { BetFilters, GameType } from '../types';
import { GAME_CONFIGS } from '../constants';

/**
 * Generates all combinations of size k from an array
 */
export const getCombinations = <T,>(array: T[], k: number): T[][] => {
  const result: T[][] = [];
  const f = (start: number, current: T[]) => {
    if (current.length === k) {
      result.push([...current]);
      return;
    }
    for (let i = start; i < array.length; i++) {
      current.push(array[i]);
      f(i + 1, current);
      current.pop();
    }
  };
  f(0, []);
  return result;
};

/**
 * Simple pseudo-random number generator with seed support
 */
export class Random {
  private seed: number;
  constructor(seedStr?: string) {
    this.seed = seedStr ? seedStr.split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0) : Math.random() * 1000000;
  }
  next() {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }
  pick<T>(arr: T[]): T {
    return arr[Math.floor(this.next() * arr.length)];
  }
}

/**
 * Filter checks for a single game (Dynamic per GameType)
 */
export const validateGame = (game: number[], filters: BetFilters, gameType: GameType): boolean => {
  const spec = GAME_CONFIGS[gameType];

  // Odd/Even
  const odds = game.filter(n => n % 2 !== 0).length;
  if (odds < filters.oddRange[0] || odds > filters.oddRange[1]) return false;

  // Sum
  const sum = game.reduce((a, b) => a + b, 0);
  if (sum < filters.sumRange[0] || sum > filters.sumRange[1]) return false;

  // Max Consecutive
  const sorted = [...game].sort((a, b) => a - b);
  let consecutiveCount = 1;
  let maxConsecutive = 1;
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === sorted[i - 1] + 1) {
      consecutiveCount++;
    } else {
      consecutiveCount = 1;
    }
    maxConsecutive = Math.max(maxConsecutive, consecutiveCount);
  }
  if (maxConsecutive > filters.maxConsecutive) return false;

  // Buckets (setores do volante divididos em 3 faixas proporcionais)
  const bucketSize = Math.ceil(spec.maxNum / 3);
  const activeBuckets = new Set<number>();
  game.forEach(n => {
    const bucketIdx = Math.floor((n - 1) / bucketSize);
    activeBuckets.add(bucketIdx);
  });
  if (activeBuckets.size < filters.minBuckets) return false;

  // Avoid all <= 31 (Apenas relevante para jogos com range > 31)
  if (filters.avoidAllLe31 && spec.maxNum > 31) {
    if (game.every(n => n <= 31)) return false;
  }

  return true;
};
