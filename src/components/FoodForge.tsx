import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  Check, 
  Plus, 
  Layers, 
  Sparkles, 
  Eye, 
  Maximize2, 
  Minimize2, 
  RotateCcw,
  Zap,
  ShoppingBag,
  Info
} from 'lucide-react';
import { Product, FoodLayer } from '../types';
import { VIKINGS_PRODUCTS } from '../data/products';
import { playLayerToggleSound, playCyberClick, playCartAddSound } from '../utils/audio';

interface FoodForgeProps {
  onAddToCart: (customProduct: Product, layers: FoodLayer[], totalCustomPrice: number) => void;
  onClose?: () => void;
}

export function FoodForge({ onAddToCart, onClose }: FoodForgeProps) {
  // Preset selection: Burger, Pastel, Hot Dog
  const baseBurger = VIKINGS_PRODUCTS.find(p => p.id === 'valhalla-cyber-smash')!;
  const basePastel = VIKINGS_PRODUCTS.find(p => p.id === 'pastel-odin-supremo')!;
  const baseHotDog = VIKINGS_PRODUCTS.find(p => p.id === 'viking-hotdog-supremo')!;

  const [selectedType, setSelectedType] = useState<'burger' | 'pastel' | 'hotdog'>('burger');
  const [explosionFactor, setExplosionFactor] = useState<number>(45); // distance between layers
  const [hoveredLayerId, setHoveredLayerId] = useState<string | null>(null);
  
  // Keep local layer states
  const [burgerLayers, setBurgerLayers] = useState<FoodLayer[]>(baseBurger.layers || []);
  const [pastelLayers, setPastelLayers] = useState<FoodLayer[]>(basePastel.layers || []);
  const [hotdogLayers, setHotdogLayers] = useState<FoodLayer[]>(baseHotDog.layers || []);

  const currentProduct = selectedType === 'burger' ? baseBurger : selectedType === 'pastel' ? basePastel : baseHotDog;
  const currentLayers = selectedType === 'burger' ? burgerLayers : selectedType === 'pastel' ? pastelLayers : hotdogLayers;
  const setCurrentLayers = selectedType === 'burger' ? setBurgerLayers : selectedType === 'pastel' ? setPastelLayers : setHotdogLayers;

  const toggleLayer = (layerId: string) => {
    const updated = currentLayers.map(layer => {
      if (layer.id === layerId) {
        const nextState = !layer.selected;
        playLayerToggleSound(nextState);
        return { ...layer, selected: nextState };
      }
      return layer;
    });
    setCurrentLayers(updated);
  };

  const resetLayers = () => {
    playCyberClick();
    const original = (currentProduct.layers || []).map(l => ({ ...l, selected: true }));
    setCurrentLayers(original);
  };

  // Calculate live telemetry
  const activeLayersCount = currentLayers.filter(l => l.selected).length;
  const totalCalories = currentLayers.filter(l => l.selected).reduce((acc, l) => acc + l.calories, 0);
  
  // Custom price based on base + modifications
  const customPrice = currentProduct.price;

  const handleAddCustomToCart = () => {
    playCartAddSound();
    onAddToCart(currentProduct, currentLayers, customPrice);
  };

  return (
    <div className="relative rounded-3xl bg-zinc-950/90 border border-amber-500/30 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl overflow-hidden">
      
      {/* Background cyber grid & glow */}
      <div className="absolute inset-0 cyber-grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Layers className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
                Forja 3D & Raio-X Tecnológico
                <Sparkles className="w-5 h-5 text-amber-400" />
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400">
                Desmonte a estrutura em camadas 3D, customize os ingredientes e teste o equilíbrio calórico.
              </p>
            </div>
          </div>
        </div>

        {/* Product Type Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-900 rounded-2xl border border-zinc-800">
          <button
            onClick={() => {
              playCyberClick();
              setSelectedType('burger');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-cyber font-bold transition-all cursor-pointer ${
              selectedType === 'burger'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            🍔 Smash Burger
          </button>
          <button
            onClick={() => {
              playCyberClick();
              setSelectedType('pastel');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-cyber font-bold transition-all cursor-pointer ${
              selectedType === 'pastel'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            🥟 Pastel 25cm
          </button>
          <button
            onClick={() => {
              playCyberClick();
              setSelectedType('hotdog');
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-cyber font-bold transition-all cursor-pointer ${
              selectedType === 'hotdog'
                ? 'bg-amber-500 text-black shadow-md shadow-amber-500/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            🌭 Hot Dog
          </button>
        </div>
      </div>

      {/* Main interactive viewport */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 items-center">
        
        {/* 3D Perspective Stage */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center min-h-[460px] relative bg-gradient-to-b from-zinc-900/60 to-black/80 rounded-2xl border border-zinc-800/80 p-6 overflow-hidden">
          
          {/* Top Stage Controls */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20">
            <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-xl border border-zinc-800 text-xs text-amber-400 font-cyber">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>VISUALIZADOR HOLOGRÁFICO ATIVO</span>
            </div>

            <button
              onClick={resetLayers}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300 text-xs font-cyber transition cursor-pointer border border-zinc-700/50"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar</span>
            </button>
          </div>

          {/* Perspective 3D Assembly Stage */}
          <div 
            className="w-full max-w-sm h-96 flex flex-col items-center justify-center transition-all duration-500 select-none"
            style={{
              perspective: '1200px',
            }}
          >
            <div
              className="w-full flex flex-col items-center justify-center transition-transform duration-700"
              style={{
                transform: 'rotateX(52deg) rotateZ(-22deg)',
                transformStyle: 'preserve-3d',
              }}
            >
              <AnimatePresence>
                {currentLayers.map((layer, index) => {
                  const isHovered = hoveredLayerId === layer.id;
                  const offsetY = (index - currentLayers.length / 2) * explosionFactor;

                  return (
                    <motion.div
                      key={layer.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8, y: offsetY }}
                      animate={{ 
                        opacity: layer.selected ? 1 : 0.25, 
                        scale: layer.selected ? (isHovered ? 1.08 : 1) : 0.85,
                        y: offsetY,
                        zIndex: currentLayers.length - index 
                      }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                      onClick={() => toggleLayer(layer.id)}
                      onMouseEnter={() => {
                        setHoveredLayerId(layer.id);
                        playCyberClick();
                      }}
                      onMouseLeave={() => setHoveredLayerId(null)}
                      className={`relative w-64 sm:w-72 h-14 rounded-2xl flex items-center justify-between px-5 cursor-pointer border transition-all duration-300 shadow-xl ${
                        layer.selected
                          ? isHovered
                            ? 'border-amber-400 bg-amber-500/30 shadow-amber-500/40 translate-x-2'
                            : 'border-amber-500/40 bg-zinc-900/90 shadow-black/80'
                          : 'border-zinc-800/60 bg-zinc-950/40 line-through opacity-30'
                      }`}
                      style={{
                        backdropFilter: 'blur(8px)',
                        boxShadow: layer.selected 
                          ? `0 ${isHovered ? 18 : 8}px 25px -5px ${layer.color}33, 0 0 10px ${layer.color}22` 
                          : 'none',
                      }}
                    >
                      {/* Left color indicator & title */}
                      <div className="flex items-center gap-3">
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm"
                          style={{ backgroundColor: layer.color }}
                        />
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-white tracking-tight">
                            {layer.name}
                          </p>
                          <p className="text-[10px] font-cyber text-zinc-400">
                            {layer.calories} kcal • {layer.category.toUpperCase()}
                          </p>
                        </div>
                      </div>

                      {/* Status indicator */}
                      <div className="flex items-center gap-1.5">
                        {layer.selected ? (
                          <span className="p-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <span className="p-1 rounded-full bg-zinc-800 text-zinc-500">
                            <Plus className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Bottom Explosion Distance Slider */}
          <div className="w-full mt-4 pt-4 border-t border-zinc-800 flex items-center justify-between gap-4 z-20">
            <div className="flex items-center gap-2 text-xs font-cyber text-zinc-400">
              <Minimize2 className="w-4 h-4 text-amber-400" />
              <span>Compacto</span>
            </div>
            
            <input
              type="range"
              min="15"
              max="65"
              value={explosionFactor}
              onChange={(e) => setExplosionFactor(Number(e.target.value))}
              className="w-full max-w-xs accent-amber-500 cursor-ew-resize h-1.5 bg-zinc-800 rounded-lg appearance-none"
              title="Ajustar separação entre camadas"
            />

            <div className="flex items-center gap-2 text-xs font-cyber text-amber-400">
              <span>Explodido</span>
              <Maximize2 className="w-4 h-4" />
            </div>
          </div>

        </div>

        {/* Right Column: Telemetry Specs & Custom Ingredients Checklist */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Active Product Name & Badge */}
          <div className="p-5 rounded-2xl bg-zinc-900/80 border border-amber-500/30">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-cyber bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {currentProduct.badge || 'Receita da Casa'}
              </span>
              <span className="text-xs font-cyber text-emerald-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> Forja Pronta
              </span>
            </div>
            <h3 className="font-heading text-xl font-bold text-white mt-2">
              {currentProduct.name}
            </h3>
            <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
              {currentProduct.description}
            </p>
          </div>

          {/* Telemetry Metrics Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
              <span className="text-[10px] font-cyber text-zinc-400 block uppercase">Calorias</span>
              <span className="text-lg font-cyber font-bold text-amber-400">{totalCalories}</span>
              <span className="text-[10px] text-zinc-500 block">kcal</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
              <span className="text-[10px] font-cyber text-zinc-400 block uppercase">Camadas</span>
              <span className="text-lg font-cyber font-bold text-amber-400">{activeLayersCount}/{currentLayers.length}</span>
              <span className="text-[10px] text-zinc-500 block">ativas</span>
            </div>
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
              <span className="text-[10px] font-cyber text-zinc-400 block uppercase">Chapa</span>
              <span className="text-lg font-cyber font-bold text-orange-400">{currentProduct.temperature.split(' ')[0]}</span>
              <span className="text-[10px] text-zinc-500 block">aquecimento</span>
            </div>
          </div>

          {/* Interactive Checklist of Layers */}
          <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 space-y-2 max-h-56 overflow-y-auto pr-1">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-800 text-xs font-cyber text-zinc-400">
              <span>Camada dos Ingredientes</span>
              <span>Ação</span>
            </div>
            {currentLayers.map((layer) => (
              <div
                key={layer.id}
                onClick={() => toggleLayer(layer.id)}
                className={`flex items-center justify-between p-2 rounded-xl text-xs transition cursor-pointer ${
                  layer.selected
                    ? 'bg-zinc-800/60 hover:bg-zinc-800 text-zinc-200'
                    : 'bg-zinc-950/40 text-zinc-500 line-through'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span 
                    className="w-2.5 h-2.5 rounded-full" 
                    style={{ backgroundColor: layer.color }}
                  />
                  <span>{layer.name}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-cyber ${
                  layer.selected ? 'bg-amber-500/20 text-amber-300' : 'bg-zinc-800 text-zinc-500'
                }`}>
                  {layer.selected ? 'Ativo' : 'Removido'}
                </span>
              </div>
            ))}
          </div>

          {/* Add to Order CTA */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/30 to-zinc-900 border border-amber-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-cyber text-zinc-400 uppercase block">Total da Receita</span>
              <span className="text-2xl font-cyber font-extrabold text-amber-400">
                R$ {customPrice.toFixed(2).replace('.', ',')}
              </span>
            </div>

            <button
              onClick={handleAddCustomToCart}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-cyber font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition cursor-pointer transform active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Adicionar ao Pedido</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
