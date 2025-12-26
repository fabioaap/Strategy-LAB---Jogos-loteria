
import React, { useState, useMemo, useEffect } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { 
  FlaskConical, 
  ShieldAlert, 
  RefreshCcw,
  ArrowRight,
  Calculator,
  Info,
  AlertTriangle,
  Coins,
  Sparkles,
  Wand2,
  Copy,
  Check,
  Dices,
  TrendingUp,
  Target,
  Zap,
  History,
  Trophy,
  Calendar,
  Wallet,
  Settings2
} from 'lucide-react';
import { GameType, StrategyObjective, PortfolioConfig, GeneratedPortfolio, BetFilters } from './types';
import { GAME_CONSTANTS, GAME_CONFIGS, DEFAULT_FILTERS, GUARDRAIL_MESSAGES } from './constants';
import { generatePortfolio } from './services/algorithm';
import { fetchLatestResult, LotteryResult } from './services/api';

// ==========================================
// --- HELPERS ---
// ==========================================

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// ==========================================
// --- UI COMPONENTS ---
// ==========================================

const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = 'primary', className = "", disabled = false, size = "md" }: { 
  children: React.ReactNode, onClick?: () => void, variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'dark', className?: string, disabled?: boolean, size?: "sm" | "md" | "lg"
}) => {
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm",
    secondary: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm",
    outline: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
    ghost: "text-slate-500 hover:bg-slate-100",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    dark: "bg-slate-900 text-white hover:bg-slate-800"
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  return (
    <button 
      disabled={disabled}
      onClick={onClick}
      className={`rounded-md font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};

const Label = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <label className={`text-sm font-semibold text-slate-700 leading-none ${className}`}>
    {children}
  </label>
);

const ProgressBar = ({ progress, label, color = "indigo", tooltip }: { progress: number, label: string, color?: string, tooltip: string }) => {
  const colors: Record<string, string> = {
    indigo: "bg-indigo-600",
    emerald: "bg-emerald-600",
    amber: "bg-amber-600"
  };
  return (
    <div className="space-y-2 w-full group relative">
      <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-500">
        <span className="flex items-center gap-1.5">
          {label}
          <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-48 p-2 bg-slate-900 text-white text-[10px] rounded shadow-xl z-50 normal-case font-normal">
            {tooltip}
          </div>
        </span>
        <span className={`text-${color}-600`}>{progress.toFixed(1)}%</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`h-full ${colors[color]} rounded-full transition-all duration-1000 ease-out`} 
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

// ==========================================
// --- PAGES ---
// ==========================================

const LandingPage = () => (
  <div className="max-w-4xl mx-auto px-6 py-20 flex flex-col items-center text-center">
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 rounded-full text-indigo-600 text-xs font-bold mb-8">
      <Sparkles size={14} /> Ferramenta Educativa & Organizacional
    </div>
    <h1 className="text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
      Sua Estratégia, <span className="text-indigo-600">Sua Matemática</span>
    </h1>
    <p className="text-lg text-slate-500 mb-10 max-w-2xl leading-relaxed">
      Aumente a eficiência das suas apostas integrando dados reais da Caixa com nossa lógica combinatória. Visualize prêmios e organize seus bilhetes de forma profissional.
    </p>
    
    <div className="flex flex-wrap gap-4 justify-center mb-16">
      <Link to="/lab">
        <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">Abrir Laboratório <ArrowRight size={18}/></Button>
      </Link>
      <Link to="/metodologia">
        <Button size="lg" variant="outline">Ver Metodologia</Button>
      </Link>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full text-left">
      {Object.values(GameType).slice(0, 4).map(type => (
        <Card key={type} className="p-4 border-slate-100">
          <h4 className="font-bold text-sm mb-1">{GAME_CONFIGS[type].name}</h4>
          <p className="text-[10px] text-slate-500">Ref. Atual: {formatCurrency(GAME_CONFIGS[type].cost)}</p>
        </Card>
      ))}
    </div>
  </div>
);

const LabPage = () => {
  const [step, setStep] = useState(0);
  const [selectedGame, setSelectedGame] = useState<GameType>(GameType.MEGA_SENA);
  const [numGames, setNumGames] = useState(10);
  const [poolSizeLimit, setPoolSizeLimit] = useState(12);
  const [manualPool, setManualPool] = useState<number[]>([]);
  const [objective, setObjective] = useState<StrategyObjective>(StrategyObjective.BALANCED);
  const [unitCost, setUnitCost] = useState(5.0); // Preço editável
  const [filters, setFilters] = useState<BetFilters>({
    ...DEFAULT_FILTERS,
    oddRange: GAME_CONFIGS[GameType.MEGA_SENA].defaultOddRange,
    sumRange: GAME_CONFIGS[GameType.MEGA_SENA].defaultSumRange
  });
  const [portfolio, setPortfolio] = useState<GeneratedPortfolio | null>(null);
  const [loading, setLoading] = useState(false);
  const [latestResult, setLatestResult] = useState<LotteryResult | null>(null);
  const [fetchingResult, setFetchingResult] = useState(false);

  const spec = GAME_CONFIGS[selectedGame];
  const strategyCost = useMemo(() => numGames * unitCost, [numGames, unitCost]);

  useEffect(() => {
    if (selectedGame && step > 0) {
      setFetchingResult(true);
      fetchLatestResult(selectedGame).then(res => {
        setLatestResult(res);
        setFetchingResult(false);
      });
    }
  }, [selectedGame, step]);

  const handleGameSelect = (type: GameType) => {
    setSelectedGame(type);
    const gameSpec = GAME_CONFIGS[type];
    setManualPool([]);
    setNumGames(10);
    setUnitCost(gameSpec.cost); // Inicia com o sugerido
    setPoolSizeLimit(gameSpec.pickSize + 4);
    setObjective(StrategyObjective.BALANCED);
    setStep(1);
  };

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      try {
        const config: PortfolioConfig = {
          gameType: selectedGame,
          budget: null,
          numGames: numGames,
          pool: [...manualPool].sort((a,b)=>a-b),
          objective,
          filters,
          candidatesN: GAME_CONSTANTS.DEFAULT_CANDIDATES_N,
          seed: Date.now().toString()
        };
        const result = generatePortfolio(config);
        // Sobrescreve o custo calculado pelo algoritmo com o custo personalizado do usuário
        result.stats.totalCost = result.games.length * unitCost;
        setPortfolio(result);
        setStep(3);
      } catch (err: any) {
        alert(err.message);
        setLoading(false);
      }
    }, 1200);
  };

  const suggestPool = () => {
    const newPool = new Set<number>();
    while(newPool.size < poolSizeLimit) {
      newPool.add(Math.floor(Math.random() * spec.maxNum) + 1);
    }
    setManualPool(Array.from(newPool).sort((a, b) => a - b));
  };

  const toggleNum = (n: number) => {
    if (manualPool.includes(n)) {
      setManualPool(manualPool.filter(x => x !== n));
    } else if (manualPool.length < poolSizeLimit) {
      setManualPool([...manualPool, n].sort((a, b) => a - b));
    }
  };

  const countHits = (game: number[], drawn: string[]) => {
    const drawnNums = drawn.map(Number);
    return game.filter(n => drawnNums.includes(n)).length;
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 pb-32">
      {/* GUARDRAILS - Mensagem dinâmica sobre preços */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex gap-3 items-start mb-6">
        <ShieldAlert className="text-amber-600 shrink-0" size={20} />
        <div className="text-xs text-amber-800 leading-relaxed font-medium">
          {GUARDRAIL_MESSAGES[0]} <br/> 
          <strong>Preços:</strong> Se o valor unitário estiver defasado, você pode ajustá-lo no próximo passo para cálculos precisos.
        </div>
      </div>

      {step === 0 && (
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-2xl font-black text-center mb-8">Escolha sua Modalidade</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(GAME_CONFIGS).map(([type, config]) => (
              <button
                key={type}
                onClick={() => handleGameSelect(type as GameType)}
                className="p-6 bg-white border border-slate-200 rounded-xl hover:border-indigo-600 hover:shadow-md transition-all text-left group"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-slate-900">{config.name}</span>
                  <div className="bg-indigo-50 px-2 py-0.5 rounded text-[10px] font-black text-indigo-600 uppercase">
                    {config.pickSize} dezenas
                  </div>
                </div>
                <p className="text-xs text-slate-500">Sugerido: {formatCurrency(config.cost)}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {step > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          
          {step === 1 && (
            <div className="max-w-xl mx-auto space-y-6">
              {/* Card de Contexto Real (Jackpot) */}
              <Card className="p-5 bg-slate-900 text-white border-none shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Trophy size={120} />
                </div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black tracking-widest text-emerald-400 flex items-center gap-1.5 uppercase">
                      <Zap size={12}/> Prêmio Acumulado via API
                    </span>
                    <span className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded">CONCURSO #{latestResult?.proximo_concurso || '...'}</span>
                  </div>
                  
                  {fetchingResult ? (
                    <div className="animate-pulse space-y-2">
                      <div className="h-8 bg-white/5 rounded w-3/4"></div>
                      <div className="h-4 bg-white/5 rounded w-1/2"></div>
                    </div>
                  ) : (
                    <>
                      <div className="text-3xl font-black text-white mb-1">
                        {latestResult?.valor_estimado_proximo_concurso 
                          ? formatCurrency(latestResult.valor_estimado_proximo_concurso)
                          : 'Carregando...'}
                      </div>
                      <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-1"><Calendar size={12}/> {latestResult?.data_proximo_concurso || '--/--/----'}</span>
                        <span className="flex items-center gap-1 text-emerald-500"><Check size={12}/> Dados Oficiais Sincronizados</span>
                      </div>
                    </>
                  )}
                </div>
              </Card>

              <Card className="p-8">
                <h2 className="text-xl font-bold mb-8 flex items-center gap-2 text-slate-900"><Coins className="text-indigo-600" /> 1. Configurar Plano</h2>
                
                <div className="space-y-8">
                  {/* Ajuste de Preço Unitário para evitar defasagem */}
                  <div className="space-y-3 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                    <div className="flex justify-between items-center mb-1">
                      <Label className="flex items-center gap-1.5 text-indigo-700">
                        <Settings2 size={14}/> Preço por Bilhete:
                      </Label>
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-tighter">Ajuste Manual</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">R$</span>
                        <input 
                          type="number" 
                          step="0.10"
                          value={unitCost}
                          onChange={e => setUnitCost(parseFloat(e.target.value) || 0)}
                          className="w-full bg-white border border-indigo-200 rounded-lg py-2 pl-10 pr-4 text-sm font-black text-indigo-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setUnitCost(spec.cost)} className="text-[10px]">Resetar</Button>
                    </div>
                    <p className="text-[9px] text-indigo-400 italic font-medium leading-tight">Mude se o preço oficial na sua região for diferente do sugerido.</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <Label>Quantidade de Volantes:</Label>
                      <span className="text-indigo-600 text-lg font-black">{numGames}</span>
                    </div>
                    <input 
                      type="range" min="1" max="60" 
                      value={numGames} 
                      onChange={e => setNumGames(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-end">
                      <Label>Pool (Banco de Dezenas):</Label>
                      <span className="text-indigo-600 text-lg font-black">{poolSizeLimit}</span>
                    </div>
                    <input 
                      type="range" min={spec.pickSize} max={spec.maxPool} 
                      value={poolSizeLimit} 
                      onChange={e => setPoolSizeLimit(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>

                  <div className="p-4 bg-slate-900 rounded-xl flex justify-between items-center shadow-lg shadow-slate-200">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total do Investimento:</div>
                    <div className="text-xl font-black text-emerald-400">{formatCurrency(strategyCost)}</div>
                  </div>
                  
                  <Button onClick={() => setStep(2)} className="w-full py-4 text-base" size="lg">Escolher Números <ArrowRight size={18}/></Button>
                  <Button variant="ghost" onClick={() => setStep(0)} className="w-full text-xs">Trocar Modalidade</Button>
                </div>
              </Card>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-lg font-bold">2. Escolha suas {poolSizeLimit} dezenas</h2>
                      <p className="text-xs text-slate-500">A estratégia irá distribuir estes números nos seus bilhetes.</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={suggestPool} className="bg-indigo-50 border-indigo-200 text-indigo-700">
                      <Dices size={14}/> Sugerir Aleatórios
                    </Button>
                  </div>
                  
                  <div className="grid gap-1 grid-cols-10 border-t border-slate-100 pt-6">
                    {Array.from({ length: spec.maxNum }, (_, i) => i + 1).map(n => {
                      const numStr = n < 10 ? `0${n}` : `${n}`;
                      const isHit = latestResult?.dezenas.includes(numStr);
                      return (
                        <button
                          key={n}
                          disabled={!manualPool.includes(n) && manualPool.length >= poolSizeLimit}
                          onClick={() => toggleNum(n)}
                          className={`aspect-square rounded flex flex-col items-center justify-center font-bold text-[10px] sm:text-xs border transition-all relative ${
                            manualPool.includes(n)
                            ? 'bg-slate-900 border-slate-900 text-white scale-105 z-10 shadow-lg'
                            : manualPool.length >= poolSizeLimit 
                              ? 'bg-slate-50 border-slate-100 text-slate-200 cursor-not-allowed opacity-40'
                              : 'bg-white border-slate-100 text-slate-300 hover:border-slate-300'
                          }`}
                        >
                          {numStr}
                          {isHit && !manualPool.includes(n) && (
                            <div className="absolute -bottom-1 w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card className="p-5 space-y-4">
                  <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                    <Info size={16}/> Resumo
                  </div>
                  <div className="space-y-3 text-[11px] text-slate-600">
                    <div className="flex justify-between"><span>Bilhetes:</span><span className="font-bold text-slate-900">{numGames}</span></div>
                    <div className="flex justify-between"><span>Pool:</span><span className="font-bold text-slate-900">{manualPool.length} / {poolSizeLimit}</span></div>
                    <div className="flex justify-between"><span>Preço Unitário:</span><span className="font-bold text-indigo-600">{formatCurrency(unitCost)}</span></div>
                    <div className="h-px bg-slate-100" />
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-slate-900">Total:</span>
                      <span className="font-black text-emerald-600">{formatCurrency(strategyCost)}</span>
                    </div>
                  </div>
                </Card>
                
                <Button 
                  onClick={handleGenerate} 
                  disabled={manualPool.length !== poolSizeLimit || loading} 
                  className="w-full py-6 bg-emerald-600 hover:bg-emerald-700 text-lg shadow-xl shadow-emerald-100"
                >
                  {loading ? <RefreshCcw size={20} className="animate-spin" /> : <>Calcular Estratégia <Zap size={18}/></>}
                </Button>
                <Button variant="ghost" onClick={() => setStep(1)} className="w-full">Voltar para Ajustes</Button>
              </div>
            </div>
          )}

          {step === 3 && portfolio && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">{spec.name}</span>
                    <h2 className="text-2xl font-black text-slate-900">Portfólio Gerado</h2>
                  </div>
                  <p className="text-sm text-slate-500">Baseado no próximo prêmio estimado em {latestResult ? formatCurrency(latestResult.valor_estimado_proximo_concurso) : '---'}.</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setStep(0)} variant="outline" size="sm"><RefreshCcw size={14}/> Novo Plano</Button>
                  <Button variant="dark" size="sm" onClick={() => window.print()}><Copy size={14}/> Imprimir Bilhetes</Button>
                </div>
              </div>

              {/* Backtest Educativo Comparativo */}
              {latestResult && (
                <Card className="p-5 bg-indigo-50 border-indigo-200">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-indigo-700 font-black text-[10px] tracking-widest uppercase">
                      <History size={16}/> Simulação no Concurso #{latestResult.concurso}
                    </div>
                    <span className="text-[10px] font-bold text-indigo-400 italic">Comparação Educativa</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Volantes c/ Acertos", val: portfolio.games.filter(g => countHits(g, latestResult.dezenas) >= (spec.pickSize - 2)).length },
                      { label: "Acertos Máximos", val: `${Math.max(...portfolio.games.map(g => countHits(g, latestResult.dezenas)))} de ${spec.pickSize}` },
                      { label: "Investimento Calculado", val: formatCurrency(portfolio.stats.totalCost) },
                      { label: "Retorno Simulado", val: "Apenas Estudo", color: "text-indigo-400" }
                    ].map((item, i) => (
                      <div key={i} className="bg-white p-3 rounded-xl border border-indigo-100 shadow-sm">
                        <div className="text-[9px] uppercase font-bold text-slate-400 mb-1">{item.label}</div>
                        <div className={`text-sm font-black ${item.color || 'text-slate-900'}`}>{item.val}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <ProgressBar progress={portfolio.stats.quadraCoverage} label="Eficiência de Cobertura" tooltip="Capacidade combinatória da sua estratégia para o pool de números escolhido." />
                </Card>
                <Card className="p-6 bg-slate-900 text-white border-none flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mb-1">Custo Total na Lotérica</p>
                    <p className="text-3xl font-black text-emerald-400">{formatCurrency(portfolio.stats.totalCost)}</p>
                    <p className="text-[9px] text-slate-500 mt-1">({portfolio.games.length} jogos x {formatCurrency(unitCost)})</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <Check size={28} className="text-emerald-400" />
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {portfolio.games.map((game, idx) => {
                  const hits = latestResult ? countHits(game, latestResult.dezenas) : 0;
                  return (
                    <Card key={idx} className={`p-5 transition-all bg-white group border-slate-200 ${hits >= (spec.pickSize - 2) ? 'ring-2 ring-emerald-400 border-emerald-400 shadow-lg shadow-emerald-50' : 'hover:border-indigo-400'}`}>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-black text-slate-300 tracking-widest uppercase">Volante #{idx+1}</span>
                        {hits > 0 && <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{hits} ACERTOS NO SIMULADOR</span>}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {game.map(n => {
                          const isHit = latestResult?.dezenas.includes(n < 10 ? `0${n}` : `${n}`);
                          return (
                            <div key={n} className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border transition-all ${isHit ? 'bg-emerald-500 border-emerald-600 text-white shadow-md scale-110' : 'bg-slate-50 text-slate-900 border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-200'}`}>
                              {n < 10 ? `0${n}` : n}
                            </div>
                          );
                        })}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const MethodologyPage = () => (
  <div className="max-w-4xl mx-auto px-6 py-20">
    <h1 className="text-4xl font-black text-slate-900 mb-8">Nossa Metodologia</h1>
    <div className="space-y-12">
      <section className="grid md:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-xl font-bold text-indigo-600 mb-4 flex items-center gap-2">
            <Calculator size={24} /> Desdobramentos Estratégicos
          </h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Em vez de apostas múltiplas caras, o Strategy Lab utiliza algoritmos para cobrir a maior quantidade possível de combinações dentro de um orçamento controlado.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Sincronizamos prêmios reais via <strong>Loterias Caixa API</strong> para contextualizar seu planejamento com os valores oficiais do próximo sorteio.
          </p>
        </div>
        <Card className="bg-slate-900 p-8 text-white border-none shadow-2xl relative">
          <div className="absolute top-0 right-0 p-4 opacity-5"><Zap size={80}/></div>
          <div className="text-emerald-400 font-black text-xs uppercase tracking-widest mb-4">Diferencial de Custo (Mega-Sena)</div>
          <div className="space-y-4">
            <div className="flex justify-between items-center opacity-60">
              <span className="text-xs">Múltipla de 12 (Oficial)</span>
              <span className="text-xs font-bold line-through">R$ 4.620,00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold">Strategy Lab (10 Bilhetes)</span>
              <span className="text-lg font-black text-emerald-400">R$ 50,00</span>
            </div>
            <div className="h-px bg-white/10" />
            <p className="text-[10px] text-slate-400 italic leading-normal">
              Mesma diversidade de dezenas (12), com redução de custo de 98% através da lógica de cobertura distribuída.
            </p>
          </div>
        </Card>
      </section>
    </div>
  </div>
);

const Navbar = () => (
  <nav className="bg-white border-b border-slate-100 px-6 py-4 sticky top-0 z-40">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2 font-black text-xl tracking-tighter text-slate-900">
        <div className="w-8 h-8 bg-indigo-600 text-white rounded flex items-center justify-center shadow-lg shadow-indigo-100">
          <FlaskConical size={18} />
        </div>
        STRATEGY<span className="text-indigo-600">LAB</span>
      </Link>
      <div className="flex gap-6">
        <Link to="/lab" className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors">Laboratório</Link>
        <Link to="/metodologia" className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors">Método</Link>
      </div>
    </div>
  </nav>
);

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/lab" element={<LabPage />} />
            <Route path="/metodologia" element={<MethodologyPage />} />
          </Routes>
        </main>
        <footer className="bg-white border-t border-slate-100 py-12 px-6 text-center mt-auto">
          <div className="max-w-2xl mx-auto opacity-50 space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Strategy Lab © 2025 - Inteligência em Loterias</p>
            <p className="text-[9px] leading-relaxed">Software educacional sincronizado via API. Permite ajuste manual de preços para precisão total. Jogue com responsabilidade.</p>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
}

export default App;
