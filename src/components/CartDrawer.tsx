import { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Sparkles, 
  ArrowRight, 
  Bike, 
  Store, 
  Tag, 
  Check, 
  CreditCard, 
  QrCode, 
  Banknote 
} from 'lucide-react';
import { CartItem, OrderDetails } from '../types';
import { playCyberClick, playSuccessChime } from '../utils/audio';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onCheckoutSuccess: (order: OrderDetails) => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckoutSuccess,
}: CartDrawerProps) {
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
  
  // Customer info
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'card' | 'cash'>('pix');

  // Coupon
  const [couponInput, setCouponInput] = useState('VIKINGS10');
  const [couponApplied, setCouponApplied] = useState(true);
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.itemTotal, 0);
  const deliveryFee = deliveryMethod === 'delivery' ? (subtotal > 60 ? 0 : 7.90) : 0;
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  const applyCoupon = () => {
    playCyberClick();
    if (couponInput.trim().toUpperCase() === 'VIKINGS10') {
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponApplied(false);
      setCouponError('Cupom inválido. Use VIKINGS10');
    }
  };

  const handleFinishOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || (deliveryMethod === 'delivery' && !address)) {
      alert('Por favor preencha seu nome e endereço de entrega.');
      return;
    }

    const orderId = `VK-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: OrderDetails = {
      orderId,
      customerName,
      customerPhone: customerPhone || '(11) 99999-9999',
      deliveryMethod,
      address: deliveryMethod === 'delivery' ? address : 'Retirada na Unidade Vikings (Bancada Valhalla)',
      paymentMethod,
      items,
      subtotal,
      discount,
      deliveryFee,
      total,
      estimatedMinutes: deliveryMethod === 'delivery' ? 35 : 15,
      createdAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    playSuccessChime();
    onCheckoutSuccess(newOrder);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#090b0e] border-l border-amber-500/30 flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/80">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="font-heading text-lg font-bold text-white">
                {step === 'cart' ? 'Banquete dos Guerreiros' : 'Finalizar Pedido Cyber'}
              </h2>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-80 text-center space-y-4">
                <div className="p-5 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-600">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <div>
                  <p className="font-cyber font-bold text-white text-base">Sua sacola está vazia</p>
                  <p className="text-xs text-zinc-500 mt-1 max-w-xs">
                    Explore hambúrgueres smash, pastéis crocantes e hot dogs prensados no nosso cardápio!
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 text-black font-cyber font-bold text-xs uppercase hover:bg-amber-400 transition cursor-pointer"
                >
                  Explorar Menu
                </button>
              </div>
            ) : step === 'cart' ? (
              // Step 1: Cart Items
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.cartItemId}
                    className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex gap-3.5 relative group"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-18 h-18 rounded-xl object-cover border border-zinc-700/60"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-sm text-white truncate">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => {
                            playCyberClick();
                            onRemoveItem(item.cartItemId);
                          }}
                          className="text-zinc-500 hover:text-red-400 transition cursor-pointer p-1"
                          title="Remover Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Addons badges */}
                      {item.selectedAddons.length > 0 && (
                        <p className="text-[11px] text-amber-400/90 mt-0.5 truncate">
                          + {item.selectedAddons.map(a => a.name).join(', ')}
                        </p>
                      )}

                      {/* Removed ingredients */}
                      {item.removedIngredients.length > 0 && (
                        <p className="text-[10px] text-red-400/80 truncate">
                          Sem: {item.removedIngredients.join(', ')}
                        </p>
                      )}

                      <div className="flex items-center justify-between mt-3">
                        {/* Quantity controls */}
                        <div className="flex items-center gap-1.5 bg-zinc-950 px-2 py-0.5 rounded-lg border border-zinc-800">
                          <button
                            onClick={() => {
                              playCyberClick();
                              onUpdateQuantity(item.cartItemId, item.quantity - 1);
                            }}
                            className="text-zinc-400 hover:text-white p-1 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-cyber font-bold text-white px-1">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => {
                              playCyberClick();
                              onUpdateQuantity(item.cartItemId, item.quantity + 1);
                            }}
                            className="text-zinc-400 hover:text-white p-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-cyber font-bold text-sm text-amber-400">
                          R$ {item.itemTotal.toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Coupon Box */}
                <div className="p-3.5 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-cyber text-zinc-400">
                    <span className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-amber-400" /> Cupom de Desconto
                    </span>
                    {couponApplied && (
                      <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                        <Check className="w-3 h-3" /> 10% Aplicado
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="CÓDIGO DO CUPOM"
                      className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs font-cyber text-amber-300 uppercase tracking-wider focus:outline-none focus:border-amber-500"
                    />
                    <button
                      onClick={applyCoupon}
                      className="px-3 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-cyber text-white transition cursor-pointer"
                    >
                      Aplicar
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] text-red-400">{couponError}</p>
                  )}
                </div>
              </div>
            ) : (
              // Step 2: Delivery & Checkout Info
              <form onSubmit={handleFinishOrder} id="checkout-form" className="space-y-4">
                
                {/* Delivery Mode Toggle */}
                <div className="space-y-2">
                  <label className="text-xs font-cyber font-bold text-zinc-400 uppercase tracking-wider block">
                    Forma de Entrega:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        playCyberClick();
                        setDeliveryMethod('delivery');
                      }}
                      className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition cursor-pointer ${
                        deliveryMethod === 'delivery'
                          ? 'bg-amber-500/10 border-amber-500 text-white'
                          : 'bg-zinc-900/60 border-zinc-800 text-zinc-400'
                      }`}
                    >
                      <Bike className="w-5 h-5 text-amber-400" />
                      <span className="text-xs font-cyber font-bold">Delivery Express</span>
                      <span className="text-[10px] text-zinc-400">30 a 40 min</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        playCyberClick();
                        setDeliveryMethod('pickup');
                      }}
                      className={`p-3 rounded-2xl border flex flex-col items-center gap-1.5 transition cursor-pointer ${
                        deliveryMethod === 'pickup'
                          ? 'bg-amber-500/10 border-amber-500 text-white'
                          : 'bg-zinc-900/60 border-zinc-800 text-zinc-400'
                      }`}
                    >
                      <Store className="w-5 h-5 text-amber-400" />
                      <span className="text-xs font-cyber font-bold">Retirar na Chapa</span>
                      <span className="text-[10px] text-zinc-400">12 a 18 min</span>
                    </button>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-cyber text-zinc-300 block mb-1">
                      Seu Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ex: Ragnar Lothbrok"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-cyber text-zinc-300 block mb-1">
                      WhatsApp para Notificação de Envio
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="(11) 98765-4321"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  {deliveryMethod === 'delivery' && (
                    <div>
                      <label className="text-xs font-cyber text-zinc-300 block mb-1">
                        Endereço Completo de Entrega *
                      </label>
                      <textarea
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Rua, Número, Bairro, Complemento e Ponto de Referência"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 resize-none h-20"
                      />
                    </div>
                  )}
                </div>

                {/* Payment Method */}
                <div className="space-y-2">
                  <label className="text-xs font-cyber font-bold text-zinc-400 uppercase tracking-wider block">
                    Forma de Pagamento:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        playCyberClick();
                        setPaymentMethod('pix');
                      }}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition cursor-pointer ${
                        paymentMethod === 'pix'
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300'
                          : 'bg-zinc-900/60 border-zinc-800 text-zinc-400'
                      }`}
                    >
                      <QrCode className="w-4 h-4" />
                      <span className="text-[11px] font-cyber font-bold">PIX Instantâneo</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        playCyberClick();
                        setPaymentMethod('card');
                      }}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition cursor-pointer ${
                        paymentMethod === 'card'
                          ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                          : 'bg-zinc-900/60 border-zinc-800 text-zinc-400'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span className="text-[11px] font-cyber font-bold">Cartão Chapa</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        playCyberClick();
                        setPaymentMethod('cash');
                      }}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition cursor-pointer ${
                        paymentMethod === 'cash'
                          ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                          : 'bg-zinc-900/60 border-zinc-800 text-zinc-400'
                      }`}
                    >
                      <Banknote className="w-4 h-4" />
                      <span className="text-[11px] font-cyber font-bold">Dinheiro</span>
                    </button>
                  </div>
                </div>

              </form>
            )}
          </div>

          {/* Footer Summary & Action */}
          {items.length > 0 && (
            <div className="p-5 bg-zinc-950 border-t border-zinc-800 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span className="font-cyber">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Desconto (Cupom)</span>
                    <span className="font-cyber">- R$ {discount.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-400">
                  <span>Taxa de Entrega</span>
                  <span className="font-cyber">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-400 font-bold">GRÁTIS</span>
                    ) : (
                      `R$ ${deliveryFee.toFixed(2).replace('.', ',')}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-zinc-800">
                  <span>Total do Pedido</span>
                  <span className="font-cyber text-amber-400 text-xl font-extrabold">
                    R$ {total.toFixed(2).replace('.', ',')}
                  </span>
                </div>
              </div>

              {step === 'cart' ? (
                <button
                  onClick={() => {
                    playCyberClick();
                    setStep('checkout');
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-cyber font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-amber-500/20 transition cursor-pointer"
                >
                  <span>Prosseguir para Pagamento</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      playCyberClick();
                      setStep('cart');
                    }}
                    className="px-4 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-cyber transition cursor-pointer"
                  >
                    Voltar
                  </button>
                  <button
                    form="checkout-form"
                    type="submit"
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-black font-cyber font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/20 transition cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Confirmar e Forjar Pedido</span>
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
