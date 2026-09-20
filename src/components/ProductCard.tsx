import { useState, useRef } from 'react';
import { Flame, Star, Plus, Eye, Clock, Zap } from 'lucide-react';
import { Product } from '../types';
import { playCyberClick, playCartAddSound } from '../utils/audio';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickAdd: (product: Product, event: React.MouseEvent) => void;
}

export function ProductCard({ product, onSelect, onQuickAdd }: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -8;
    const rY = ((x - centerX) / centerX) * 8;

    setRotateX(rX);
    setRotateY(rY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.18,
    });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos(prev => ({ ...prev, opacity: 0 }));
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative rounded-3xl p-[1px] transition-all duration-300 group"
      style={{
        perspective: '1000px',
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      }}
    >
      {/* Dynamic ambient rim border */}
      <div 
        className={`absolute inset-0 rounded-3xl transition-opacity duration-500 ${
          isHovered
            ? 'bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 opacity-80 blur-[2px]'
            : 'bg-zinc-800/80 opacity-40'
        }`}
      />

      {/* Main Card Surface */}
      <div className="relative rounded-3xl bg-[#0d1015]/95 backdrop-blur-xl border border-zinc-800/80 p-5 flex flex-col h-full overflow-hidden shadow-xl">
        
        {/* Holographic Specular Glare */}
        <div
          className="pointer-events-none absolute inset-0 rounded-3xl transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(245, 158, 11, ${glarePos.opacity}) 0%, transparent 60%)`,
          }}
        />

        {/* Top Media Container */}
        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black/40 border border-zinc-800 group/img">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-108"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

          {/* Badge */}
          {product.badge && (
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-amber-500/40 text-amber-300 text-[11px] font-cyber font-bold shadow-lg">
              {product.badge}
            </div>
          )}

          {/* Rating */}
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-zinc-700 text-white text-[11px] font-cyber font-bold">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{product.rating.toFixed(1)}</span>
          </div>

          {/* Bottom telemetry overlay on image */}
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-cyber text-zinc-300">
            <span className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
              <Clock className="w-3 h-3 text-amber-400" />
              {product.prepTime}
            </span>
            <span className="bg-black/60 px-2 py-0.5 rounded-md backdrop-blur-sm text-amber-400">
              {product.calories} kcal
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col pt-4">
          
          {/* Category indicator & Spiciness */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-cyber uppercase tracking-wider text-amber-500 font-bold">
              {product.category === 'burger' ? '🍔 Hambúrguer Smash' : product.category === 'pastel' ? '🥟 Pastel Crocante' : product.category === 'hotdog' ? '🌭 Hot Dog Prensado' : '⚔️ Combo Banquete'}
            </span>
            {product.spiciness > 0 && (
              <div className="flex items-center gap-0.5" title={`Nível de Picância: ${product.spiciness}/3`}>
                {Array.from({ length: product.spiciness }).map((_, i) => (
                  <Flame key={i} className="w-3 h-3 text-red-500 fill-red-500" />
                ))}
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="font-heading text-lg font-bold text-white mt-1 group-hover:text-amber-300 transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed flex-1">
            {product.description}
          </p>

          {/* Price & Action Row */}
          <div className="pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-between">
            <div>
              {product.originalPrice && (
                <span className="text-[11px] text-zinc-500 line-through block -mb-1 font-cyber">
                  R$ {product.originalPrice.toFixed(2).replace('.', ',')}
                </span>
              )}
              <div className="flex items-baseline gap-1">
                <span className="text-xs text-amber-400 font-cyber font-bold">R$</span>
                <span className="font-cyber text-xl font-extrabold text-white">
                  {product.price.toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Raio-X / Inspect details button */}
              <button
                onClick={() => {
                  playCyberClick();
                  onSelect(product);
                }}
                className="p-2.5 rounded-xl bg-zinc-800/70 hover:bg-zinc-700 text-zinc-300 hover:text-white transition cursor-pointer border border-zinc-700/50"
                title="Ver Raio-X e Personalizar"
              >
                <Eye className="w-4 h-4" />
              </button>

              {/* Quick Add button */}
              <button
                onClick={(e) => {
                  playCartAddSound();
                  onQuickAdd(product, e);
                }}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-cyber font-bold text-xs uppercase shadow-md shadow-amber-500/20 transition cursor-pointer transform active:scale-95"
                title="Adicionar ao Pedido"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Pedir</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
