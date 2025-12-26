
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
  Settings2,
  ExternalLink
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
      Aumente a eficiência das suas apostas integrando dados reais da Caixa com nossa lógica combinatória. Organize seus bilhetes com base em custos reais atualizados.
    </p>
    
    <div className="flex flex-wrap gap-4 justify-center mb-16">
      <Link to="/lab">
        <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700">
          Abrir Laboratório <ArrowRight size={18} />
        </Button>
      </Link>
    </div>

    <div className="grid md:grid-cols-3 gap-8 text-left">
      <Card className="p-6">
        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 mb-4">
          <Calculator size={20} />
        </div>
        <h3 className="font-bold text-slate-900 mb-2">Cobertura Matemática</h3>
        <p className="text-sm text-slate-500">Otimize para Quadras e Quinas usando algoritmos gulosos de cobertura.</p>
      </Card>
      <Card className="p-6">
        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 mb-4">
          <ShieldAlert size={20} />
        </div>
        <h3 className="font-bold text-slate-900 mb-2">Filtros Inteligentes</h3>
        <p className="text-sm text-slate-500">Aplique restrições de somas, pares/ímpares e sequências para jogos equilibrados.</p>
      </Card>
      <Card className="p-6">
        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600 mb-4">
          <Zap size={20} />
        </div>
        <h3 className="font-bold text-slate-900 mb-2">Dados em Tempo Real</h3>
        <p className="text-sm text-slate-500">Últimos resultados e custos oficiais integrados diretamente da API.</p>
      </Card>
    </div>
  </div>
);

const LabPage = () => {
  const [activeGameType, setActiveGameType] = useState<GameType>(GameType.MEGA_SENA);
  const [pool, setPool] = useState<number[]>([]);
  const [numGames, setNumGames] = useState(10);
  const [objective, setObjective] = useState<StrategyObjective>(StrategyObjective.BALANCED);
  const [filters, setFilters] = useState<BetFilters>({
    ...DEFAULT_FILTERS,
    oddRange: GAME_CONFIGS[GameType.MEGA_SENA].defaultOddRange,
    sumRange: GAME_CONFIGS[GameType.MEGA_SENA].defaultSumRange
  });

  const [result, setResult] = useState<GeneratedPortfolio | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [latestDraw, setLatestDraw] = useState<LotteryResult | null>(null);

  const spec = GAME_CONFIGS[activeGameType];

  useEffect(() => {
    setPool([]);
    setFilters({
      ...DEFAULT_FILTERS,
      oddRange: GAME_CONFIGS[activeGameType].defaultOddRange,
      sumRange: GAME_CONFIGS[activeGameType].defaultSumRange
    });
    setResult(null);
    setError(null);
    fetchLatestResult(activeGameType).then(setLatestDraw);
  }, [activeGameType]);

  const toggleNumber = (num: number) => {
    setPool(prev => prev.includes(num) ? prev.filter(n => n !== num) : [...prev, num].sort((a,b) => a-b));
  };

  const handleGenerate = () => {
    if (pool.length < spec.minPool) {
      setError(`Selecione pelo menos ${spec.minPool} números.`);
      return;
    }
    setError(null);
    setLoading(true);
    
    setTimeout(() => {
      try {
        const genResult = generatePortfolio({
          gameType: activeGameType,
          budget: null,
          numGames,
          pool,
          objective,
          filters,
          candidatesN: GAME_CONSTANTS.DEFAULT_CANDIDATES_N
        });
        setResult(genResult);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }, 100);
  };

  const copyToClipboard = (game: number[], index: number) => {
    navigator.clipboard.writeText(game.join(', '));
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] bg-slate-50">
      <div className="w-full lg:w-80 border-r border-slate-200 bg-white overflow-y-auto p-6 space-y-8 shrink-0">
        <div>
          <Label className="block mb-3">Tipo de Jogo</Label>
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(GAME_CONFIGS).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setActiveGameType(key as GameType)}
                className={`flex items-center justify-between p-3 rounded-lg border text-sm transition-all ${
                  activeGameType === key 
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold' 
                    : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-300'
                }`}
              >
                <span>{config.name}</span>
                <span className="text-[10px] opacity-60">R$ {config.cost.toFixed(2)}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Target size={18} className="text-indigo-600" />
            <Label>Configuração</Label>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-slate-500 mb-1.5 block">Qtd. de Jogos</Label>
              <input 
                type="range" min="1" max="100" value={numGames} 
                onChange={(e) => setNumGames(parseInt(e.target.value))}
                className="w-full accent-indigo-600"
              />
              <div className="text-right font-bold text-indigo-600">{numGames} jogos</div>
            </div>
            <div>
              <Label className="text-xs text-slate-500 mb-1.5 block">Objetivo</Label>
              <select 
                value={objective} 
                onChange={(e) => setObjective(e.target.value as StrategyObjective)}
                className="w-full p-2 rounded-md border border-slate-200 text-sm"
              >
                <option value={StrategyObjective.BALANCED}>Equilibrado</option>
                <option value={StrategyObjective.QUADRA}>Focar Quadra</option>
                <option value={StrategyObjective.QUINA}>Focar Quina</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <FlaskConical size={18} className="text-indigo-600" />
            <Label>Filtros</Label>
          </div>
          <div className="space-y-4">
             <div className="flex items-center gap-2">
               <input 
                 type="checkbox" id="avoidAllLe31" 
                 checked={filters.avoidAllLe31} 
                 onChange={(e) => setFilters(f => ({...f, avoidAllLe31: e.target.checked}))}
               />
               <label htmlFor="avoidAllLe31" className="text-xs text-slate-600 cursor-pointer">Evitar apenas datas (≤31)</label>
             </div>
          </div>
        </div>

        <Button 
          className="w-full" 
          onClick={handleGenerate} 
          disabled={loading || pool.length < spec.minPool}
        >
          {loading ? <RefreshCcw className="animate-spin" /> : <Wand2 size={18} />}
          Gerar Estratégia
        </Button>

        {error && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-600 text-xs flex gap-2">
            <AlertTriangle size={14} className="shrink-0" />
            {error}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Dices className="text-indigo-600" size={20} />
                Seu Pool de Números ({pool.length}/{spec.maxPool})
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setPool([])}>Limpar</Button>
            </div>
            <Card className="p-6 bg-white border-2 border-slate-100">
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {Array.from({ length: spec.maxNum }, (_, i) => i + 1).map(num => (
                  <button
                    key={num}
                    onClick={() => toggleNumber(num)}
                    disabled={!pool.includes(num) && pool.length >= spec.maxPool}
                    className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      pool.includes(num)
                        ? 'bg-indigo-600 text-white shadow-lg scale-110'
                        : 'bg-slate-100 text-slate-400 hover:bg-slate-200 disabled:opacity-30'
                    }`}
                  >
                    {num.toString().padStart(2, '0')}
                  </button>
                ))}
              </div>
            </Card>
          </section>

          {result && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 bg-indigo-50 border-indigo-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 text-white rounded-lg flex items-center justify-center">
                      <Wallet size={20} />
                    </div>
                    <div>
                      <div className="text-[10px] text-indigo-600 font-bold uppercase">Custo Total</div>
                      <div className="text-xl font-black text-indigo-900">{formatCurrency(result.stats.totalCost)}</div>
                    </div>
                  </div>
                </Card>
                <Card className="p-4 bg-white">
                  <ProgressBar progress={result.stats.quadraCoverage} label="Cobertura Quadra" color="indigo" tooltip="Percentual de todas as quadras possíveis do pool cobertas." />
                </Card>
                <Card className="p-4 bg-white">
                  <ProgressBar progress={result.stats.quinaCoverage} label="Cobertura Quina" color="emerald" tooltip="Percentual de todas as quinas possíveis do pool cobertas." />
                </Card>
              </div>

              <section>
                <h3 className="text-md font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Sparkles size={18} className="text-amber-500" />
                  Jogos Gerados ({result.games.length})
                </h3>
                <div className="grid gap-3">
                  {result.games.map((game, idx) => (
                    <Card key={idx} className="flex items-center justify-between p-3 hover:border-indigo-200 transition-colors group">
                      <div className="flex flex-wrap gap-2">
                        {game.map(n => (
                          <span key={n} className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-xs font-bold border border-slate-200">
                            {n.toString().padStart(2, '0')}
                          </span>
                        ))}
                      </div>
                      <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100" onClick={() => copyToClipboard(game, idx)}>
                        {copiedIndex === idx ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                      </Button>
                    </Card>
                  ))}
                </div>
              </section>
            </div>
          )}

          {!result && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {latestDraw && (
                <Card className="p-5 border-l-4 border-indigo-500">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm font-bold text-indigo-900">Último Concurso #{latestDraw.concurso}</div>
                    <Trophy size={18} className="text-amber-500" />
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {latestDraw.dezenas.map(d => (
                      <span key={d} className="w-7 h-7 rounded-full bg-indigo-900 text-white flex items-center justify-center text-xs font-bold">
                        {d}
                      </span>
                    ))}
                  </div>
                  <div className="text-[10px] text-slate-400">Sorteado em: {latestDraw.data}</div>
                </Card>
              )}
              <Card className="p-5 border-l-4 border-amber-500 bg-amber-50/30 text-[10px]">
                <h4 className="text-sm font-bold text-amber-900 mb-2 flex items-center gap-2">
                  <Info size={16} /> Responsabilidade
                </h4>
                <ul className="text-amber-800 space-y-1.5 list-disc pl-4">
                  {GUARDRAIL_MESSAGES.map((msg, i) => <li key={i}>{msg}</li>)}
                </ul>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// --- MAIN APP ---
// ==========================================

const App = () => {
  return (
    <HashRouter>
      <div className="min-h-screen bg-white text-slate-900 font-sans antialiased">
        <header className="border-b border-slate-100 bg-white sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-indigo-600 text-white p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
                <FlaskConical size={20} />
              </div>
              <span className="font-black text-xl tracking-tight text-slate-900">
                Loto<span className="text-indigo-600">Lab</span>
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-sm font-medium text-slate-500 hover:text-indigo-600">Início</Link>
              <Link to="/lab" className="text-sm font-medium text-slate-500 hover:text-indigo-600">Laboratório</Link>
              <a href="https://loterias.caixa.gov.br" target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs bg-slate-100 px-3 py-1.5 rounded-full text-slate-600 hover:bg-slate-200">
                Site Oficial <ExternalLink size={12} />
              </a>
            </nav>
          </div>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/lab" element={<LabPage />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
