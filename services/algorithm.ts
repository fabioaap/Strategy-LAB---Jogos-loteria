
import { PortfolioConfig, GeneratedPortfolio, StrategyObjective } from '../types';
import { GAME_CONSTANTS, GAME_CONFIGS } from '../constants';
import { getCombinations, validateGame, Random } from '../utils/math';

export const generatePortfolio = (config: PortfolioConfig): GeneratedPortfolio => {
  const { gameType, pool, numGames, filters, candidatesN, objective, seed } = config;
  const spec = GAME_CONFIGS[gameType];
  const rng = new Random(seed);
  
  // 1. Generate and Filter Candidates
  const candidates: number[][] = [];
  let attempts = 0;
  const maxAttempts = candidatesN * 10; 

  while (candidates.length < candidatesN && attempts < maxAttempts) {
    attempts++;
    const game: number[] = [];
    const poolCopy = [...pool];
    
    // Draw pickSize random numbers from the pool
    for (let i = 0; i < spec.pickSize; i++) {
      if (poolCopy.length === 0) break;
      const idx = Math.floor(rng.next() * poolCopy.length);
      game.push(poolCopy.splice(idx, 1)[0]);
    }
    game.sort((a, b) => a - b);

    if (game.length === spec.pickSize && validateGame(game, filters, gameType)) {
      const gameStr = game.join(',');
      if (!candidates.some(c => c.join(',') === gameStr)) {
        candidates.push(game);
      }
    }
  }

  if (candidates.length === 0) {
    throw new Error("Nenhum candidato atende aos filtros. Tente relaxar as restrições ou aumentar o seu pool de números.");
  }

  // 2. Map all possible subsets of 4 and 5 in the pool (Wheeling limited for performance)
  // For games with large pickSize like Lotofácil (15), we focus on subsets relative to the target prizes
  const k4 = Math.min(spec.pickSize - 2, 6); // Adapt subset size
  const k5 = Math.min(spec.pickSize - 1, 7); 

  // We optimize for coverage of smaller subsets relative to the game's prize tiers
  const poolSubsets4 = pool.length <= 20 ? getCombinations(pool, 4).map(s => s.sort((a,b)=>a-b).join(',')) : [];
  const poolSubsets5 = pool.length <= 18 ? getCombinations(pool, 5).map(s => s.sort((a,b)=>a-b).join(',')) : [];
  
  const subset4Map = new Map<string, number>();
  poolSubsets4.forEach((s, i) => subset4Map.set(s, i));
  const subset5Map = new Map<string, number>();
  poolSubsets5.forEach((s, i) => subset5Map.set(s, i));

  // 3. Pre-calculate subsets for each candidate
  const candidateData = candidates.map(game => {
    const s4 = poolSubsets4.length > 0 ? getCombinations(game, 4).map(s => subset4Map.get(s.sort((a,b)=>a-b).join(','))).filter(v => v !== undefined) as number[] : [];
    const s5 = poolSubsets5.length > 0 ? getCombinations(game, 5).map(s => subset5Map.get(s.sort((a,b)=>a-b).join(','))).filter(v => v !== undefined) as number[] : [];
    return { game, s4, s5 };
  });

  // 4. Greedy Selection
  const selectedGames: number[][] = [];
  const covered4 = new Set<number>();
  const covered5 = new Set<number>();
  
  const targetCount = Math.min(numGames, candidates.length);
  const remainingCandidates = [...candidateData];

  for (let i = 0; i < targetCount; i++) {
    let bestIdx = -1;
    let maxNewScore = -1;

    for (let j = 0; j < remainingCandidates.length; j++) {
      const cand = remainingCandidates[j];
      let new4 = 0;
      let new5 = 0;

      for (const id of cand.s4) if (!covered4.has(id)) new4++;
      for (const id of cand.s5) if (!covered5.has(id)) new5++;

      let score = 0;
      if (objective === StrategyObjective.QUADRA) score = new4 * 10 + new5;
      else if (objective === StrategyObjective.QUINA) score = new5 * 10 + new4;
      else score = new4 * 2 + new5 * 5;

      if (score > maxNewScore) {
        maxNewScore = score;
        bestIdx = j;
      }
    }

    if (bestIdx === -1) break;

    const winner = remainingCandidates.splice(bestIdx, 1)[0];
    selectedGames.push(winner.game);
    winner.s4.forEach(id => covered4.add(id));
    winner.s5.forEach(id => covered5.add(id));
  }

  return {
    games: selectedGames,
    stats: {
      candidatesGenerated: attempts,
      candidatesAccepted: candidates.length,
      quadraCoverage: poolSubsets4.length > 0 ? (covered4.size / poolSubsets4.length) * 100 : 0,
      quinaCoverage: poolSubsets5.length > 0 ? (covered5.size / poolSubsets5.length) * 100 : 0,
      totalCost: selectedGames.length * spec.cost
    }
  };
};
