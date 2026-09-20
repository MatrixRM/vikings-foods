import { Flame, ShieldCheck, Zap, ArrowRight, Layers, Sparkles, Star } from 'lucide-react';
import burgerImg from '../assets/images/gourmet_burger_1789865647988.jpg';
import pastelImg from '../assets/images/crispy_pastel_1789865657214.jpg';
import hotdogImg from '../assets/images/gourmet_hotdog_1789865669310.jpg';
import { playCyberClick } from '../utils/audio';

interface HeroSectionProps {
  onExploreClick: () => void;
  onOpenForge: () => void;
}

export function HeroSection({ onExploreClick, onOpenForge }: HeroSectionProps) {
  return (
    <section className="relative pt-6 pb-16 lg:pt-12 lg:pb-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Technological Headline & Value Prop */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Cyber Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-cyber tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Gastronomia Nórdica de Alta Tecnologia</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            </div>

            {/* Main Headline */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
              Hambúrgueres, Pastéis e Hot Dogs Forjados no{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-500 drop-shadow-[0_0_25px_rgba(245,158,11,0.35)]">
                Fogo Supremo
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-zinc-300 max-w-2xl leading-relaxed font-light">
              Massa artesanal de pastel com microbolhas douradas, smash burgers de Angus grelhados a 300°C e o clássico cachorro-quente prensado no ferro com purê aveludado e catupiry maçaricado.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  playCyberClick();
                  onExploreClick();
                }}
                className="group relative inline-flex items-center gap-3 px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-extrabold text-sm font-cyber uppercase tracking-wider shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>Explorar Cardápio</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => {
                  playCyberClick();
                  onOpenForge();
                }}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800/80 border border-amber-500/30 text-amber-300 hover:text-white font-cyber text-sm tracking-wide transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Montador 3D / Raio-X</span>
              </button>
            </div>

            {/* Proof Metric Chips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-zinc-800/80">
              <div className="bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/60 backdrop-blur-sm">
                <div className="flex items-center gap-1.5 text-amber-400 font-cyber font-bold text-lg">
                  <Star className="w-4 h-4 fill-amber-400" /> 4.95
                </div>
                <div className="text-[11px] text-zinc-400 mt-0.5">Avaliação Valhalla</div>
              </div>
              
              <div className="bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/60 backdrop-blur-sm">
                <div className="flex items-center gap-1.5 text-amber-400 font-cyber font-bold text-lg">
                  <Flame className="w-4 h-4 text-orange-400" /> 300°C
                </div>
                <div className="text-[11px] text-zinc-400 mt-0.5">Chapa Vulcânica</div>
              </div>

              <div className="bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/60 backdrop-blur-sm">
                <div className="flex items-center gap-1.5 text-amber-400 font-cyber font-bold text-lg">
                  <Zap className="w-4 h-4 text-yellow-400" /> 30-40m
                </div>
                <div className="text-[11px] text-zinc-400 mt-0.5">Entrega Ágil</div>
              </div>

              <div className="bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/60 backdrop-blur-sm">
                <div className="flex items-center gap-1.5 text-amber-400 font-cyber font-bold text-lg">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100%
                </div>
                <div className="text-[11px] text-zinc-400 mt-0.5">Artesanal Puro</div>
              </div>
            </div>

          </div>

          {/* Right Column: Holographic Showcase / Animated Interactive Visuals */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Glowing backplate */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-amber-500/20 via-orange-500/10 to-transparent rounded-3xl blur-2xl opacity-75" />

              {/* Main Futuristic Card Container */}
              <div className="relative rounded-3xl bg-zinc-900/80 border border-amber-500/30 p-5 shadow-2xl backdrop-blur-xl overflow-hidden group">
                
                {/* Tech Scan Line Effect */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-60 animate-cyber-pulse" />

                {/* Top card header */}
                <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse" />
                    <span className="font-cyber text-xs font-bold text-amber-300 tracking-wider">
                      TRILOGIA VIKINGS
                    </span>
                  </div>
                  <span className="text-[11px] font-cyber text-zinc-400 bg-zinc-800/60 px-2.5 py-1 rounded-md border border-zinc-700/50">
                    SABORES SUPREMOS
                  </span>
                </div>

                {/* Triple Product Visual Grid */}
                <div className="mt-4 grid grid-cols-3 gap-2.5">
                  {/* Burger */}
                  <div className="relative rounded-2xl overflow-hidden border border-amber-500/20 bg-black/40 group/item hover:border-amber-400/60 transition duration-300">
                    <img
                      src={burgerImg}
                      alt="Burger Gourmet"
                      referrerPolicy="no-referrer"
                      className="w-full h-28 object-cover group-hover/item:scale-110 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="absolute bottom-1.5 left-2 right-2">
                      <p className="text-[10px] font-cyber text-amber-400 font-bold uppercase">Burger</p>
                      <p className="text-xs font-bold text-white leading-tight truncate">Smash Angus</p>
                    </div>
                  </div>

                  {/* Pastel */}
                  <div className="relative rounded-2xl overflow-hidden border border-amber-500/20 bg-black/40 group/item hover:border-amber-400/60 transition duration-300">
                    <img
                      src={pastelImg}
                      alt="Pastel Crocante"
                      referrerPolicy="no-referrer"
                      className="w-full h-28 object-cover group-hover/item:scale-110 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="absolute bottom-1.5 left-2 right-2">
                      <p className="text-[10px] font-cyber text-amber-400 font-bold uppercase">Pastel</p>
                      <p className="text-xs font-bold text-white leading-tight truncate">25cm Crocante</p>
                    </div>
                  </div>

                  {/* Hot Dog */}
                  <div className="relative rounded-2xl overflow-hidden border border-amber-500/20 bg-black/40 group/item hover:border-amber-400/60 transition duration-300">
                    <img
                      src={hotdogImg}
                      alt="Hot Dog Prensado"
                      referrerPolicy="no-referrer"
                      className="w-full h-28 object-cover group-hover/item:scale-110 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                    <div className="absolute bottom-1.5 left-2 right-2">
                      <p className="text-[10px] font-cyber text-amber-400 font-bold uppercase">Hot Dog</p>
                      <p className="text-xs font-bold text-white leading-tight truncate">Prensado Puro</p>
                    </div>
                  </div>
                </div>

                {/* Interactive Interactive Preview Teaser Bar */}
                <div className="mt-5 p-3 rounded-2xl bg-gradient-to-r from-amber-950/40 via-zinc-900/80 to-amber-950/40 border border-amber-500/30 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-cyber text-amber-300 font-bold">
                      MONTE NA FORJA 3D
                    </p>
                    <p className="text-[11px] text-zinc-400">
                      Desmonte em camadas e personalize ingredientes
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      playCyberClick();
                      onOpenForge();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 text-black font-cyber font-bold text-xs hover:bg-amber-400 transition cursor-pointer"
                  >
                    Testar
                  </button>
                </div>

              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
