import { useState } from 'react';
import { X, Flame, Check, Plus, Minus, Clock, ShieldCheck, ShoppingBag, Sparkles } from 'lucide-react';
import { Product, ProductAddon } from '../types';
import { playCyberClick, playCartAddSound } from '../utils/audio';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (
    product: Product,
    quantity: number,
    selectedAddons: ProductAddon[],
    removedIngredients: string[],
    notes: string,
    itemTotal: number
  ) => void;
}

export function ProductModal({ product, onClose, onAddToCart }: ProductModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedAddons, setSelectedAddons] = useState<ProductAddon[]>([]);
  const [removedIngredients, setRemovedIngredients] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  const toggleAddon = (addon: ProductAddon) => {
    playCyberClick();
    setSelectedAddons(prev => {
      const exists = prev.some(a => a.id === addon.id);
      if (exists) {
        return prev.filter(a => a.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  const toggleIngredientRemoval = (ingredient: string) => {
    playCyberClick();
    setRemovedIngredients(prev => {
      if (prev.includes(ingredient)) {
        return prev.filter(i => i !== ingredient);
      } else {
        return [...prev, ingredient];
      }
    });
  };

  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = product.price + addonsTotal;
  const totalPrice = unitPrice * quantity;

  const handleConfirm = () => {
    playCartAddSound();
    onAddToCart(product, quantity, selectedAddons, removedIngredients, notes, totalPrice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-[#0d1015] border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden z-10 my-8">
        
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/60 transition cursor-pointer backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image with Cyber Overlay */}
        <div className="relative w-full h-64 sm:h-72 bg-black overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1015] via-transparent to-black/40" />

          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div>
              {product.badge && (
                <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-cyber font-bold">
                  {product.badge}
                </span>
              )}
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white mt-2">
                {product.name}
              </h2>
              <p className="text-xs font-cyber text-amber-400 mt-1">
                {product.tagline}
              </p>
            </div>

            <div className="bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-zinc-700 text-right">
              <span className="text-[10px] font-cyber text-zinc-400 block uppercase">Preço Base</span>
              <span className="text-lg font-cyber font-extrabold text-amber-400">
                R$ {product.price.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[65vh] overflow-y-auto">
          
          {/* Description & Technical Specs */}
          <div>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {product.description}
            </p>

            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
                <span className="text-[10px] font-cyber text-zinc-400 block uppercase">Tempo de Chapa</span>
                <span className="text-xs font-cyber font-bold text-amber-300">{product.prepTime}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
                <span className="text-[10px] font-cyber text-zinc-400 block uppercase">Calorias</span>
                <span className="text-xs font-cyber font-bold text-amber-300">{product.calories} kcal</span>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
                <span className="text-[10px] font-cyber text-zinc-400 block uppercase">Temperatura</span>
                <span className="text-xs font-cyber font-bold text-orange-400">{product.temperature.split(' ')[0]}</span>
              </div>
            </div>
          </div>

          {/* Customize Ingredients: Remove Options */}
          {product.ingredients.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-cyber font-bold text-zinc-200 uppercase tracking-wider">
                  Personalizar Ingredientes (Remover se desejar):
                </h4>
                <span className="text-[11px] text-zinc-400">Clique para remover</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ing) => {
                  const isRemoved = removedIngredients.includes(ing);
                  return (
                    <button
                      key={ing}
                      onClick={() => toggleIngredientRemoval(ing)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer border ${
                        isRemoved
                          ? 'bg-red-950/40 border-red-500/50 text-red-300 line-through'
                          : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                      }`}
                    >
                      {isRemoved ? `Sem ${ing}` : ing}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add-ons Checklist */}
          {product.addons.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-cyber font-bold text-zinc-200 uppercase tracking-wider">
                Adicionais Extras para a Forja:
              </h4>

              <div className="space-y-2">
                {product.addons.map((addon) => {
                  const isChecked = selectedAddons.some(a => a.id === addon.id);
                  return (
                    <div
                      key={addon.id}
                      onClick={() => toggleAddon(addon)}
                      className={`flex items-center justify-between p-3 rounded-2xl border transition cursor-pointer ${
                        isChecked
                          ? 'bg-amber-500/10 border-amber-500/50 text-white'
                          : 'bg-zinc-900/40 border-zinc-800 text-zinc-300 hover:bg-zinc-900/70'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition ${
                          isChecked ? 'bg-amber-500 border-amber-400 text-black' : 'border-zinc-700 bg-zinc-800'
                        }`}>
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <span className="text-xs sm:text-sm font-medium">{addon.name}</span>
                      </div>
                      <span className="text-xs font-cyber font-bold text-amber-400">
                        + R$ {addon.price.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Observations */}
          <div className="space-y-2">
            <label className="text-xs font-cyber font-bold text-zinc-300 uppercase tracking-wider block">
              Observações Especiais para o Mestre da Chapa:
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Ponto da carne mais tostadinho, molho à parte, cortar pastel ao meio..."
              className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl p-3 text-xs sm:text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition resize-none h-20"
            />
          </div>

        </div>

        {/* Footer Checkout Row */}
        <div className="p-6 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between gap-4">
          {/* Quantity Stepper */}
          <div className="flex items-center gap-2 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
            <button
              onClick={() => {
                playCyberClick();
                setQuantity(q => Math.max(1, q - 1));
              }}
              disabled={quantity <= 1}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white disabled:opacity-30 cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-8 text-center font-cyber font-bold text-sm text-white">
              {quantity}
            </span>
            <button
              onClick={() => {
                playCyberClick();
                setQuantity(q => q + 1);
              }}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Add to Order CTA */}
          <button
            onClick={handleConfirm}
            className="flex-1 flex items-center justify-between px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-cyber font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-amber-500/20 transition cursor-pointer transform active:scale-95"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Adicionar ao Pedido</span>
            </div>
            <span>R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
