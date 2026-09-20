import { useState } from 'react';
import { Volume2, VolumeX, ShoppingBag, Flame, Sparkles } from 'lucide-react';
import logoImg from '../assets/images/vikings_logo_1789865638147.jpg';
import { ProductCategory } from '../types';
import { getSoundMuted, setSoundMuted, playCyberClick } from '../utils/audio';

interface NavbarProps {
  activeCategory: ProductCategory;
  onSelectCategory: (category: ProductCategory) => void;
  onOpenForge: () => void;
  cartCount: number;
  onOpenCart: () => void;
}

export function Navbar({
  activeCategory,
  onSelectCategory,
  onOpenForge,
  cartCount,
  onOpenCart,
}: NavbarProps) {
  const [muted, setMutedState] = useState(getSoundMuted());

  const toggleSound = () => {
    const next = !muted;
    setMutedState(next);
    setSoundMuted(next);
    if (!next) {
      playCyberClick();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-amber-500/20 bg-[#090b0e]/85 backdrop-blur-xl transition-all">
      {/* Top telemetry ticker */}
      <div className="bg-gradient-to-r from-amber-950/40 via-amber-900/30 to-amber-950/40 border-b border-amber-500/10 px-4 py-1 text-xs text-amber-300/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-cyber tracking-wider text-[11px] uppercase">
            CHAPA VULCÂNICA ATIVA: 300°C • SISTEMA ONLINE
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[11px] font-cyber">
          <span className="text-zinc-400">TEMPO MÉDIO DE PREPARO: <strong className="text-amber-400">12 MIN</strong></span>
          <span className="text-zinc-400">ENTREGA VIA DRONE/MOTO: <strong className="text-amber-400">30-40 MIN</strong></span>
          <span className="text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">CUPOM: VIKINGS10 (-10%)</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand */}
          <div 
            onClick={() => {
              playCyberClick();
              onSelectCategory('all');
            }}
            className="flex items-center gap-3.5 cursor-pointer group select-none"
          >
            <div className="relative">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full blur-md opacity-40 group-hover:opacity-80 transition duration-300" />
              <img
                src={logoImg}
                alt="Vikings Foods Logo"
                referrerPolicy="no-referrer"
                className="relative w-12 h-12 rounded-full border-2 border-amber-400/80 object-cover shadow-lg transform group-hover:scale-105 transition duration-300"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-xl sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 tracking-tight">
                  VIKINGS
                </span>
                <span className="font-cyber font-bold text-sm sm:text-base text-zinc-300 tracking-widest">
                  FOODS
                </span>
              </div>
              <p className="text-[10px] font-cyber text-amber-500/90 tracking-wider uppercase -mt-0.5">
                Cyber Gastronomia Artesanal
              </p>
            </div>
          </div>

          {/* Center Category Nav (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 bg-zinc-900/60 p-1 rounded-xl border border-zinc-800/80">
            <button
              onClick={() => {
                playCyberClick();
                onSelectCategory('all');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeCategory === 'all'
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              Todos os Itens
            </button>
            <button
              onClick={() => {
                playCyberClick();
                onSelectCategory('burger');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeCategory === 'burger'
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              Hambúrgueres
            </button>
            <button
              onClick={() => {
                playCyberClick();
                onSelectCategory('pastel');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeCategory === 'pastel'
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              Pastéis Crocantes
            </button>
            <button
              onClick={() => {
                playCyberClick();
                onSelectCategory('hotdog');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeCategory === 'hotdog'
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              Cachorros-Quentes
            </button>
            <button
              onClick={() => {
                playCyberClick();
                onSelectCategory('combo');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeCategory === 'combo'
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20 font-bold'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              Combos
            </button>
          </nav>

          {/* Action buttons: Sound FX, 3D Food Forge Button, Cart */}
          <div className="flex items-center gap-2.5">
            {/* Interactive 3D Forge Action Button */}
            <button
              onClick={() => {
                playCyberClick();
                onOpenForge();
              }}
              className="relative group hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/10 via-orange-500/20 to-amber-500/10 border border-amber-500/40 text-amber-300 hover:text-white hover:border-amber-400 transition duration-300 cursor-pointer overflow-hidden"
              title="Abrir Montador e Raio-X 3D"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition duration-300" />
              <Flame className="w-4 h-4 text-amber-400 animate-bounce" />
              <span className="font-cyber text-xs font-bold tracking-wide">
                FORJA 3D
              </span>
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            </button>

            {/* Sound Toggle Button */}
            <button
              onClick={toggleSound}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                muted
                  ? 'border-zinc-800 bg-zinc-900/60 text-zinc-500 hover:text-zinc-300'
                  : 'border-amber-500/40 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
              }`}
              title={muted ? 'Ativar Efeitos Sonoros' : 'Silenciar Efeitos Sonoros'}
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Cart Drawer Trigger */}
            <button
              id="cart-trigger-button"
              onClick={() => {
                playCyberClick();
                onOpenCart();
              }}
              className="relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer transform active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden md:inline font-cyber text-xs uppercase tracking-wider">
                Meu Pedido
              </span>
              {cartCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-extrabold bg-zinc-950 text-amber-400 rounded-full border border-amber-400/50 animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
