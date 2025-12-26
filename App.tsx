
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
  Target,
  Zap,
  History,
  Trophy,
  Calendar,
  Wallet,
  Settings2,
  ExternalLink,
  ChevronRight,
  UserCheck,
  Share2,
  History as HistoryIcon,
  HelpCircle
} from 'lucide-react';
import { GameType, StrategyObjective, PortfolioConfig, GeneratedPortfolio, BetFilters, LuckyStyle, LuckyNumberResult } from './types';
import { GAME_CONSTANTS, GAME_CONFIGS, DEFAULT_FILTERS, GUARDRAIL_MESSAGES, REAL_PROBABILITIES, STYLE_INFO } from './constants';
import { generatePortfolio, generateLuckyNumbers } from './services/algorithm';
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
  <div className={`bg-white rounded-[32px] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden ${className}`}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = 'primary', className = "", disabled = false, size = "md" }: { 
  children: React.ReactNode, onClick?: () => void, variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'dark', className?: string, disabled?: boolean, size?: "sm" | "md" | "lg"
}) => {
  const variants = {
    primary: "bg-[#4F46E5] text-white hover:bg-[#4338CA] shadow-lg shadow-indigo-100",
    secondary: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md",
    outline: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
    ghost: "text-slate-500 hover:bg-slate-100",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    dark: "bg-slate-900 text-white hover:bg-slate-800"
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base"
  };
  return (
    <button 
      disabled={disabled}
      onClick={onClick}
      className={`rounded-2xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};

const Label = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <label className={`text-[13px] font-bold text-slate-700 leading-none ${className}`}>
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
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
        <span className="flex items-center gap-1.5">
          {label}
          <div className="absolute bottom-full left-0 mb-2 hidden group-hover:block w-48 p-2 bg-slate-900 text-white text-[10px] rounded shadow-xl z-50 normal-case font-normal">
            {tooltip}
          </div>
        </span>
        <span className={`text-${color}-600 font-black`}>{progress.toFixed(1)}%</span>
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
// --- TABS ---
// ==========================================

const InfluencerTab = ({ latestDraw }: { latestDraw: LotteryResult | null }) => {
  const [count, setCount] = useState(3);
  const [style, setStyle] = useState<LuckyStyle>(LuckyStyle.BALANCED);
  const [palpites, setPalpites] = useState<LuckyNumberResult[]>([]);
  const [generating, setGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = () => {
    setGenerating(true);
    setPalpites([]);
    setTimeout(() => {
      const results = generateLuckyNumbers(style, count);
      setPalpites(results);
      setGenerating(false);
    }, 800);
  };

  const handleShare = async (game: number[]) => {
    const text = `Montei minha estratégia de Mega-Sena no Strategy Lab! 🧪✨\n\nNúmeros: ${game.join(' - ')}\n\nCrie a sua aqui: ${window.location.href}`;
    if (navigator.share) {
      await navigator.share({ title: 'Minha Estratégia', text });
    } else {
      navigator.clipboard.writeText(text);
      alert('Link e números copiados para compartilhar!');
    }
  };

  const checkHits = (game: number[]) => {
    if (!latestDraw) return null;
    const drawNumbers = latestDraw.dezenas.map(d => parseInt(d));
    return game.filter(n => drawNumbers.includes(n)).length;
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto pt-10">
      <div className="p-1 rounded-[40px] bg-gradient-to-br from-indigo-100 via-white to-amber-50">
        <Card className="p-10 space-y-8 border-none bg-white/80 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-amber-400 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-amber-100 rotate-3">
              <Sparkles size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Gerador Premium</h2>
              <p className="text-sm text-slate-500 font-medium">Algoritmos de estilo para seu próximo bilhete.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label>Quantidade de Jogos</Label>
              <div className="relative">
                <select 
                  value={count} 
                  onChange={e => setCount(Number(e.target.value))}
                  className="w-full p-4 rounded-2xl bg-[#1E1B4B] border-none text-white text-sm font-bold focus:ring-4 focus:ring-indigo-200 cursor-pointer appearance-none transition-all"
                >
                  <option value={1}>01 Palpite</option>
                  <option value={2}>02 Palpites</option>
                  <option value={3}>03 Palpites</option>
                </select>
                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 rotate-90" size={18} />
              </div>
            </div>
            <div className="space-y-3">
              <Label>Lógica de Jogo</Label>
              <div className="relative">
                <select 
                  value={style} 
                  onChange={e => setStyle(e.target.value as LuckyStyle)}
                  className="w-full p-4 rounded-2xl bg-[#1E1B4B] border-none text-white text-sm font-bold focus:ring-4 focus:ring-indigo-200 cursor-pointer appearance-none transition-all"
                >
                  {Object.entries(STYLE_INFO).map(([key, info]) => (
                    <option key={key} value={key}>{info.label}</option>
                  ))}
                </select>
                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 rotate-90" size={18} />
              </div>
            </div>
          </div>

          {/* HELP BOX - DINÂMICO */}
          <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex gap-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="shrink-0 w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
               <HelpCircle size={20} />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-black text-indigo-900 uppercase tracking-widest">{STYLE_INFO[style].label}</p>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                {STYLE_INFO[style].desc} <span className="text-indigo-600 font-bold">{STYLE_INFO[style].belief}</span>
              </p>
            </div>
          </div>

          <Button 
            onClick={handleGenerate} 
            disabled={generating}
            className="w-full py-6 text-sm uppercase tracking-[0.2em] bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100 relative overflow-hidden group"
          >
            {generating ? (
              <RefreshCcw className="animate-spin" />
            ) : (
              <>
                GERAR NÚMEROS DA SORTE
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </>
            )}
          </Button>
        </Card>
      </div>

      {palpites.length > 0 && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">Bilhetes Sugeridos</h3>
            {latestDraw && (
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-[10px] font-bold text-slate-500">
                <HistoryIcon size={12} /> vs Concurso #{latestDraw.concurso}
              </div>
            )}
          </div>
          
          <div className="grid gap-6">
            {palpites.map((p, i) => {
              const hits = checkHits(p.game);
              return (
                <Card key={i} className="p-8 space-y-6 hover:shadow-2xl transition-all border-none relative bg-white">
                  {hits !== null && hits >= 4 && (
                    <div className="absolute top-0 right-10 -translate-y-1/2 bg-amber-400 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase shadow-lg animate-bounce">
                      🏆 Teria ganho prêmio!
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estratégia {i+1}</span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleShare(p.game)}
                        className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-indigo-600"
                      >
                        <Share2 size={18} />
                      </button>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(p.game.join(', '));
                          setCopiedIndex(i);
                          setTimeout(() => setCopiedIndex(null), 2000);
                        }}
                        className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-indigo-600"
                      >
                        {copiedIndex === i ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-3 justify-center">
                    {p.game.map(n => {
                      const isHit = latestDraw?.dezenas.includes(n.toString().padStart(2, '0'));
                      return (
                        <div 
                          key={n} 
                          className={`w-14 h-14 rounded-[20px] flex items-center justify-center font-black text-xl shadow-lg transform hover:scale-110 transition-all border-b-4 ${
                            isHit 
                              ? 'bg-emerald-500 text-white border-emerald-700' 
                              : 'bg-slate-900 text-white border-slate-700'
                          }`}
                        >
                          {n.toString().padStart(2, '0')}
                        </div>
                      );
                    })}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-6 rounded-[24px] space-y-3">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Info size={14} className="text-indigo-400"/> Lógica Aplicada
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed font-semibold italic">"{STYLE_INFO[style].desc}"</p>
                    </div>
                    
                    <div className="bg-indigo-50/50 p-6 rounded-[24px] flex flex-col justify-center">
                       <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-3">Chance (Jogo Simples)</div>
                       <div className="flex justify-between items-center text-[10px] font-black text-indigo-900 uppercase">
                          <span>Sena</span>
                          <span className="bg-white px-2 py-0.5 rounded-lg border border-indigo-100">1 em 50M</span>
                       </div>
                       <div className="flex justify-between items-center text-[10px] font-black text-indigo-900 uppercase mt-2">
                          <span>Quadra</span>
                          <span className="bg-white px-2 py-0.5 rounded-lg border border-indigo-100">1 em 2.3k</span>
                       </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const PortfolioTab = () => {
  const [activeGameType] = useState<GameType>(GameType.MEGA_SENA);
  const [pool, setPool] = useState<number[]>([]);
  const [numGames, setNumGames] = useState(10);
  const [objective, setObjective] = useState<StrategyObjective>(StrategyObjective.BALANCED);
  const [filters, setFilters] = useState<BetFilters>(DEFAULT_FILTERS);

  const [result, setResult] = useState<GeneratedPortfolio | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const spec = GAME_CONFIGS[activeGameType];

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

  const showCoverage = pool.length >= 10 && numGames >= 2;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto pt-10 pb-20">
      <div className="lg:col-span-4 space-y-6">
        <Card className="p-8 space-y-8">
          <div className="flex items-center gap-3">
            <Target size={24} className="text-indigo-600" />
            <h3 className="font-black text-slate-900 text-lg">Laboratório</h3>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-3">
                <Label>Qtd. de Volantes</Label>
                <span className="text-xs font-black text-indigo-600">{numGames}</span>
              </div>
              <input 
                type="range" min="1" max="60" value={numGames} 
                onChange={(e) => setNumGames(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div className="space-y-3">
              <Label>Prioridade do Algoritmo</Label>
              <select 
                value={objective} 
                onChange={(e) => setObjective(e.target.value as StrategyObjective)}
                className="w-full p-4 rounded-2xl border border-slate-200 text-sm font-bold bg-slate-50 focus:ring-2 focus:ring-indigo-500 transition-all"
              >
                <option value={StrategyObjective.BALANCED}>Equilibrado (Recomendado)</option>
                <option value={StrategyObjective.QUADRA}>Maximizar Quadras</option>
                <option value={StrategyObjective.QUINA}>Maximizar Quinas</option>
              </select>
            </div>
          </div>

          <Button 
            className="w-full py-5 text-sm uppercase tracking-widest shadow-xl shadow-indigo-100" 
            onClick={handleGenerate} 
            disabled={loading || pool.length < spec.minPool}
          >
            {loading ? <RefreshCcw className="animate-spin" /> : <Wand2 size={20} />}
            CALCULAR ESTRATÉGIA
          </Button>

          {error && <div className="text-[11px] text-red-500 font-bold bg-red-50 p-4 rounded-xl border border-red-100">{error}</div>}
        </Card>
      </div>

      <div className="lg:col-span-8 space-y-8">
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
              <Dices className="text-indigo-600" size={20} /> Seu Pool ({pool.length}/{spec.maxPool})
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setPool([])} className="text-[10px] font-black tracking-widest hover:text-red-500">LIMPAR VOLANTE</Button>
          </div>
          <Card className="p-8 bg-white">
            <div className="grid grid-cols-6 sm:grid-cols-10 gap-3">
              {Array.from({ length: spec.maxNum }, (_, i) => i + 1).map(num => (
                <button
                  key={num}
                  onClick={() => toggleNumber(num)}
                  disabled={!pool.includes(num) && pool.length >= spec.maxPool}
                  className={`aspect-square rounded-2xl flex items-center justify-center text-sm font-black transition-all ${
                    pool.includes(num)
                      ? 'bg-indigo-600 text-white shadow-lg scale-110 z-10'
                      : 'bg-slate-50 text-slate-300 hover:text-slate-500 hover:bg-slate-100 disabled:opacity-20'
                  }`}
                >
                  {num.toString().padStart(2, '0')}
                </button>
              ))}
            </div>
          </Card>
        </section>

        {result && (
          <div className="space-y-6 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card className="p-6 bg-[#1E1B4B] text-white border-none flex items-center justify-between shadow-xl">
                <div>
                  <div className="text-[10px] text-indigo-300 font-black uppercase tracking-widest mb-1">Custo Estimado</div>
                  <div className="text-3xl font-black text-emerald-400">{formatCurrency(result.stats.totalCost)}</div>
                </div>
                <div className="p-3 bg-white/5 rounded-2xl">
                   <Wallet className="text-emerald-400" size={32} />
                </div>
              </Card>
              
              {showCoverage ? (
                <Card className="p-6 space-y-4 flex flex-col justify-center bg-white">
                  <ProgressBar progress={result.stats.quadraCoverage} label="Eficiência de Cobertura" tooltip="Mede quão bem seus jogos cobrem as combinações possíveis do pool escolhido." />
                </Card>
              ) : (
                <Card className="p-6 flex items-center justify-center text-[11px] font-bold text-slate-400 italic bg-slate-50 border-dashed">
                  Aumente o pool para ver a eficiência.
                </Card>
              )}
            </div>

            <div className="grid gap-4">
              {result.games.map((game, idx) => (
                <Card key={idx} className="flex items-center justify-between p-6 group hover:border-indigo-200 shadow-sm bg-white">
                  <div className="flex flex-wrap gap-3">
                    {game.map(n => (
                      <span key={n} className="w-10 h-10 rounded-[14px] bg-slate-50 text-slate-900 flex items-center justify-center text-sm font-black border border-slate-100">
                        {n.toString().padStart(2, '0')}
                      </span>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="rounded-xl p-2 hover:bg-indigo-50" onClick={() => {
                    navigator.clipboard.writeText(game.join(', '));
                    setCopiedIndex(idx);
                    setTimeout(() => setCopiedIndex(null), 2000);
                  }}>
                    {copiedIndex === idx ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} />}
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// --- MAIN APP ---
// ==========================================

const App = () => {
  const [tab, setTab] = useState<'influencer' | 'lab'>('influencer');
  const [latestDraw, setLatestDraw] = useState<LotteryResult | null>(null);

  useEffect(() => {
    fetchLatestResult(GameType.MEGA_SENA).then(setLatestDraw);
  }, []);

  return (
    <HashRouter>
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased pb-32">
        {/* DISCLAMER FIXO */}
        <div className="bg-[#FFF4D2] border-b border-amber-100 px-4 py-2 text-center sticky top-0 z-[60]">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <ShieldAlert size={14} className="text-[#92400E] shrink-0" />
            <p className="text-[11px] font-black text-[#92400E] uppercase tracking-[0.15em] leading-tight">
              ISSO NÃO É PREVISÃO. FILTROS NÃO GARANTEM PRÊMIO. — JOGUE COM RESPONSABILIDADE.
            </p>
          </div>
        </div>

        <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 px-8 py-6 sticky top-[36px] md:top-[31px] z-50">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-indigo-600 text-white p-2.5 rounded-[18px] group-hover:rotate-12 transition-transform shadow-xl shadow-indigo-100">
                <FlaskConical size={26} />
              </div>
              <span className="font-black text-2xl tracking-tighter text-[#1E1B4B]">
                STRATEGY<span className="text-indigo-600">LAB</span>
              </span>
            </Link>
            
            <div className="flex bg-slate-100 p-1.5 rounded-[22px] gap-1 shadow-inner">
              <button 
                onClick={() => setTab('influencer')}
                className={`px-8 py-3 rounded-[18px] text-[11px] font-black uppercase tracking-[0.1em] transition-all flex items-center gap-2 ${tab === 'influencer' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {tab === 'influencer' && <Sparkles size={14} />}
                Palpites
              </button>
              <button 
                onClick={() => setTab('lab')}
                className={`px-8 py-3 rounded-[18px] text-[11px] font-black uppercase tracking-[0.1em] transition-all flex items-center gap-2 ${tab === 'lab' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {tab === 'lab' && <Calculator size={14} />}
                Portfólio
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-8">
          {tab === 'influencer' ? <InfluencerTab latestDraw={latestDraw} /> : <PortfolioTab />}
        </main>

        <footer className="mt-32 border-t border-slate-100 py-16 px-8">
          <div className="max-w-4xl mx-auto text-center space-y-8 opacity-60">
            <div className="flex justify-center gap-8">
              <FlaskConical className="text-indigo-400" size={24} />
              <ShieldAlert className="text-amber-400" size={24} />
              <Calculator className="text-emerald-400" size={24} />
            </div>
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-400">Strategy Lab — Tecnologia & Probabilidade</p>
            <p className="text-[10px] leading-relaxed max-w-2xl mx-auto font-medium">
              Este software é uma ferramenta organizacional. Loterias são jogos de azar controlados pelo governo. Cada combinação de 6 números tem exatamente 1 chance em 50.063.860 de ser sorteada. O uso de algoritmos visa a eficiência de cobertura e estética, não a previsão de sorteio.
            </p>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
