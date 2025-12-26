
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
  UserCheck
} from 'lucide-react';
import { GameType, StrategyObjective, PortfolioConfig, GeneratedPortfolio, BetFilters, LuckyStyle, LuckyNumberResult } from './types';
import { GAME_CONSTANTS, GAME_CONFIGS, DEFAULT_FILTERS, GUARDRAIL_MESSAGES, REAL_PROBABILITIES } from './constants';
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

const InfluencerTab = () => {
  const [count, setCount] = useState(3);
  const [style, setStyle] = useState<LuckyStyle>(LuckyStyle.BALANCED);
  const [palpites, setPalpites] = useState<LuckyNumberResult[]>([]);
  const [quizAnswered, setQuizAnswered] = useState(false);
  const [quizCorrect, setQuizCorrect] = useState<boolean | null>(null);

  const handleGenerate = () => {
    const results = generateLuckyNumbers(style, count);
    setPalpites(results);
    setQuizAnswered(false);
    console.log('generate_lucky_numbers', { style, count });
  };

  const handleQuiz = (ans: string) => {
    const correct = ans === 'B';
    setQuizCorrect(correct);
    setQuizAnswered(true);
    console.log('quiz_answer', { correct });
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto pt-10">
      <div className="p-1 rounded-[32px] bg-slate-200/30">
        <Card className="p-10 space-y-8 border-none">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
              <UserCheck size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Palpites do Influencer</h2>
              <p className="text-sm text-slate-500 font-medium">Heurísticas estéticas para o seu próximo jogo.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <Label>Quantidade</Label>
              <select 
                value={count} 
                onChange={e => setCount(Number(e.target.value))}
                className="w-full p-4 rounded-2xl bg-[#333] border-none text-white text-sm font-bold focus:ring-2 focus:ring-indigo-500 cursor-pointer appearance-none"
                style={{backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.25em'}}
              >
                <option value={1}>1 Palpite</option>
                <option value={2}>2 Palpites</option>
                <option value={3}>3 Palpites</option>
              </select>
            </div>
            <div className="space-y-3">
              <Label>Estilo do Palpite</Label>
              <select 
                value={style} 
                onChange={e => setStyle(e.target.value as LuckyStyle)}
                className="w-full p-4 rounded-2xl bg-[#333] border-none text-white text-sm font-bold focus:ring-2 focus:ring-indigo-500 cursor-pointer appearance-none"
                style={{backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.25em'}}
              >
                <option value={LuckyStyle.BALANCED}>Equilibrado</option>
                <option value={LuckyStyle.HOT}>Quentes (Sugestão)</option>
                <option value={LuckyStyle.COLD}>Frios (Sugestão)</option>
                <option value={LuckyStyle.ANTI_POPULAR}>Anti-Popularidade</option>
                <option value={LuckyStyle.RANDOM}>Aleatório Puro</option>
              </select>
            </div>
          </div>

          <Button onClick={handleGenerate} className="w-full py-5 text-sm uppercase tracking-widest bg-[#4F46E5] hover:bg-[#4338CA]">
            GERAR NÚMEROS DA SORTE <Sparkles size={18} />
          </Button>
        </Card>
      </div>

      {palpites.length > 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Resultados Gerados</h3>
            <span className="text-[10px] font-bold text-slate-400">Mega-Sena</span>
          </div>
          
          <div className="grid gap-4">
            {palpites.map((p, i) => (
              <Card key={i} className="p-8 space-y-6 hover:border-indigo-100 transition-all shadow-[0_4px_20px_rgb(0,0,0,0.03)]">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Palpite #{i+1}</span>
                  <div className="flex gap-2">
                    {p.isAntiPopular && <span className="bg-emerald-50 text-emerald-600 text-[9px] font-black px-3 py-1 rounded-full uppercase border border-emerald-100">Anti-Popular</span>}
                    {p.hasLongSequence && <span className="bg-amber-50 text-amber-600 text-[9px] font-black px-3 py-1 rounded-full uppercase border border-amber-100">Sequência</span>}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3 justify-center py-4">
                  {p.game.map(n => (
                    <div key={n} className="w-14 h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xl shadow-xl transform hover:scale-105 transition-transform">
                      {n.toString().padStart(2, '0')}
                    </div>
                  ))}
                </div>

                <div className="bg-slate-50 p-6 rounded-[24px] space-y-4">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Info size={14} className="text-indigo-400"/> Por que esse palpite?
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium italic">"{p.explanation}"</p>
                  
                  <div className="h-px bg-slate-200 my-2" />
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Sena</div>
                      <div className="text-xs font-black text-slate-900">{REAL_PROBABILITIES[GameType.MEGA_SENA].sena}</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Quina</div>
                      <div className="text-xs font-black text-slate-900">{REAL_PROBABILITIES[GameType.MEGA_SENA].quina}</div>
                    </div>
                    <div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Quadra</div>
                      <div className="text-xs font-black text-slate-900">{REAL_PROBABILITIES[GameType.MEGA_SENA].quadra}</div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-8 bg-indigo-900 text-white border-none shadow-2xl">
            <h4 className="text-md font-black mb-4 flex items-center gap-3">
              <Zap size={20} className="text-amber-400"/> Desafio do Apostador
            </h4>
            {!quizAnswered ? (
              <div className="space-y-6">
                <p className="text-sm text-indigo-100 font-medium">O que realmente aumenta suas chances de ganhar na loteria?</p>
                <div className="grid grid-cols-1 gap-3">
                  <button onClick={() => handleQuiz('A')} className="text-left text-xs bg-white/10 p-4 rounded-2xl hover:bg-white/20 transition-all font-semibold">A) Escolher números 'quentes' do influencer</button>
                  <button onClick={() => handleQuiz('B')} className="text-left text-xs bg-white/10 p-4 rounded-2xl hover:bg-white/20 transition-all font-semibold">B) Aumentar o volume de combinações (cobertura)</button>
                  <button onClick={() => handleQuiz('C')} className="text-left text-xs bg-white/10 p-4 rounded-2xl hover:bg-white/20 transition-all font-semibold">C) Prever números através de padrões estéticos</button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 animate-in fade-in duration-300">
                <p className={`text-lg font-black ${quizCorrect ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {quizCorrect ? 'CERTO!' : 'OPS!'} Resposta: B
                </p>
                <p className="text-xs text-indigo-100 leading-relaxed italic font-medium">
                  "Matematicamente, a única forma de aumentar a chance é cobrindo mais combinações únicas. Estilos são apenas escolhas estéticas."
                </p>
              </div>
            )}
          </Card>
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
    console.log('generate_portfolio', { poolSize: pool.length, numGames, objective });
    
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto pt-10">
      <div className="lg:col-span-4 space-y-6">
        <Card className="p-8 space-y-8">
          <div className="flex items-center gap-3">
            <Target size={24} className="text-indigo-600" />
            <h3 className="font-black text-slate-900 text-lg">Configuração</h3>
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
              <Label>Objetivo Estratégico</Label>
              <select 
                value={objective} 
                onChange={(e) => setObjective(e.target.value as StrategyObjective)}
                className="w-full p-4 rounded-2xl border border-slate-200 text-sm font-bold bg-slate-50 focus:ring-2 focus:ring-indigo-500"
              >
                <option value={StrategyObjective.BALANCED}>Equilibrado</option>
                <option value={StrategyObjective.QUADRA}>Maximizar Quadra</option>
                <option value={StrategyObjective.QUINA}>Maximizar Quina</option>
              </select>
            </div>
          </div>

          <Button 
            className="w-full py-5 text-sm uppercase tracking-widest" 
            onClick={handleGenerate} 
            disabled={loading || pool.length < spec.minPool}
          >
            {loading ? <RefreshCcw className="animate-spin" /> : <Wand2 size={20} />}
            CALCULAR PORTFÓLIO
          </Button>

          {error && <div className="text-[11px] text-red-500 font-bold bg-red-50 p-3 rounded-xl border border-red-100">{error}</div>}
        </Card>
      </div>

      <div className="lg:col-span-8 space-y-8">
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
              <Dices className="text-indigo-600" size={20} /> Banco de Dezenas ({pool.length}/{spec.maxPool})
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setPool([])} className="text-[10px] font-black tracking-widest hover:text-red-500">RESET</Button>
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
              <Card className="p-6 bg-slate-900 text-white border-none flex items-center justify-between shadow-xl">
                <div>
                  <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Investimento</div>
                  <div className="text-3xl font-black text-emerald-400">{formatCurrency(result.stats.totalCost)}</div>
                </div>
                <div className="p-3 bg-white/10 rounded-2xl">
                   <Wallet className="text-emerald-400" size={32} />
                </div>
              </Card>
              
              {showCoverage ? (
                <Card className="p-6 space-y-4">
                  <ProgressBar progress={result.stats.quadraCoverage} label="Cobertura Quadra" tooltip="Percentual de quadras possíveis do seu pool que estão presentes nos seus jogos." />
                </Card>
              ) : (
                <Card className="p-6 flex items-center justify-center text-[11px] font-bold text-slate-400 italic">
                  Cobertura não aplicável para este pool.
                </Card>
              )}
            </div>

            <div className="grid gap-4">
              {result.games.map((game, idx) => (
                <Card key={idx} className="flex items-center justify-between p-6 group hover:border-indigo-200 shadow-sm">
                  <div className="flex flex-wrap gap-3">
                    {game.map(n => (
                      <span key={n} className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-900 flex items-center justify-center text-sm font-black border border-slate-100 shadow-sm">
                        {n.toString().padStart(2, '0')}
                      </span>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="opacity-0 group-hover:opacity-100 transition-all rounded-xl" onClick={() => {
                    navigator.clipboard.writeText(game.join(', '));
                    setCopiedIndex(idx);
                    setTimeout(() => setCopiedIndex(null), 2000);
                  }}>
                    {copiedIndex === idx ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
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

  useEffect(() => {
    console.log('lab_view', { tab });
  }, [tab]);

  return (
    <HashRouter>
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans antialiased pb-32">
        {/* FIXED DISCLAIMER MATCHING SCREENSHOT */}
        <div className="bg-[#FFF4D2] border-b border-amber-100 px-4 py-2 text-center">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <ShieldAlert size={14} className="text-[#92400E] shrink-0" />
            <p className="text-[11px] font-black text-[#92400E] uppercase tracking-[0.15em] leading-tight">
              ISSO NÃO É PREVISÃO. FILTROS E COBERTURA NÃO GARANTEM PRÊMIO. — A CHANCE DE UM JOGO SIMPLES É IGUAL PARA QUALQUER COMBINAÇÃO DE 6 NÚMEROS.
            </p>
          </div>
        </div>

        <header className="bg-white border-b border-slate-100 px-8 py-6 sticky top-[36px] md:top-[31px] z-40">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-indigo-600 text-white p-2.5 rounded-[18px] group-hover:rotate-12 transition-transform shadow-xl shadow-indigo-100">
                <FlaskConical size={26} />
              </div>
              <span className="font-black text-2xl tracking-tighter text-[#1E1B4B]">
                STRATEGY<span className="text-indigo-600">LAB</span>
              </span>
            </Link>
            
            <div className="flex bg-[#F1F5F9] p-1 rounded-2xl gap-1">
              <button 
                onClick={() => setTab('influencer')}
                className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.1em] transition-all flex items-center gap-2 ${tab === 'influencer' ? 'bg-white text-indigo-600 shadow-[0_4px_12px_rgba(0,0,0,0.05)] border-l-2 border-r-2 border-indigo-50' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {tab === 'influencer' && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                Influencer Tips
              </button>
              <button 
                onClick={() => setTab('lab')}
                className={`px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.1em] transition-all flex items-center gap-2 ${tab === 'lab' ? 'bg-white text-indigo-600 shadow-[0_4px_12px_rgba(0,0,0,0.05)] border-l-2 border-r-2 border-indigo-50' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {tab === 'lab' && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                Portfólio (Lab)
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-8">
          {tab === 'influencer' ? <InfluencerTab /> : <PortfolioTab />}
        </main>

        <footer className="mt-32 border-t border-slate-100 py-16 px-8">
          <div className="max-w-4xl mx-auto text-center space-y-8 opacity-60">
            <div className="flex justify-center gap-6">
              <FlaskConical className="text-indigo-400" size={24} />
              <ShieldAlert className="text-amber-400" size={24} />
              <Calculator className="text-emerald-400" size={24} />
            </div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Strategy Lab © 2025 — Projeto Educativo</p>
            <p className="text-[10px] leading-relaxed max-w-2xl mx-auto font-medium">
              Este protótipo sincroniza dados estéticos e matemáticos. Nunca aposte mais do que pode perder. Loterias são eventos aleatórios onde cada combinação tem a mesma probabilidade teórica de sorteio. O uso de filtros é puramente para organização pessoal e estética de jogo.
            </p>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
