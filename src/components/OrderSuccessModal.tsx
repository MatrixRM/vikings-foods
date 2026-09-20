import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Flame, 
  Clock, 
  Copy, 
  Check, 
  Bike, 
  ShieldCheck, 
  Sparkles, 
  QrCode,
  Share2
} from 'lucide-react';
import { OrderDetails } from '../types';
import { playCyberClick } from '../utils/audio';

interface OrderSuccessModalProps {
  order: OrderDetails;
  onClose: () => void;
}

export function OrderSuccessModal({ order, onClose }: OrderSuccessModalProps) {
  const [copiedPix, setCopiedPix] = useState(false);
  const [activeStage, setActiveStage] = useState(1); // 0 to 3

  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ef4444', '#10b981', '#ffffff']
      });
    } catch {
      // Ignore if confetti fails
    }

    // Simulate cyber radar stage advancement
    const timer = setInterval(() => {
      setActiveStage(prev => (prev < 3 ? prev + 1 : prev));
    }, 12000);

    return () => clearInterval(timer);
  }, []);

  const dummyPixCode = `00020126580014BR.GOV.BCB.PIX0136vikings-foods-chapa@cyberpix.br520400005303986540${order.total.toFixed(2)}5802BR5913VIKINGS FOODS6009SAO PAULO62070503***6304E8F2`;

  const handleCopyPix = () => {
    playCyberClick();
    navigator.clipboard.writeText(dummyPixCode);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2500);
  };

  const stages = [
    { title: 'Sinal Recebido', desc: 'Comanda inserida na esteira da Valhalla', icon: CheckCircle2 },
    { title: 'Na Forja a 300°C', desc: 'Hambúrgueres, pastéis e dogs em montagem quente', icon: Flame },
    { title: 'Selagem & Qualidade', desc: 'Embalagem térmica anti-impacto selada', icon: ShieldCheck },
    { title: 'Em Rota Express', desc: 'Motociclista / Drone a caminho do seu endereço', icon: Bike },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/90 backdrop-blur-md transition-opacity"
      />

      <div className="relative w-full max-w-xl bg-[#0b0e14] border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 my-8 overflow-hidden">
        
        {/* Glow halo */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        
        {/* Header Notification */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-amber-500/20 border border-emerald-500/40 text-emerald-400 mb-2">
            <Sparkles className="w-8 h-8 animate-spin" style={{ animationDuration: '6s' }} />
          </div>

          <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
            Pedido Forjado com Sucesso!
          </h2>
          
          <p className="text-xs sm:text-sm text-zinc-400 font-cyber">
            CÓDIGO DA COMANDA: <span className="text-amber-400 font-bold">{order.orderId}</span>
          </p>
        </div>

        {/* Live Cyber Radar Tracker */}
        <div className="mt-8 p-5 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-cyber text-amber-400 font-bold flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> RADAR DE PREPARAÇÃO EM TEMPO REAL
            </span>
            <span className="text-[11px] font-cyber text-zinc-400">
              ~{order.estimatedMinutes} min restantes
            </span>
          </div>

          {/* Stepper Progress Bar */}
          <div className="space-y-4 pt-2">
            {stages.map((stage, idx) => {
              const isPast = idx < activeStage;
              const isCurrent = idx === activeStage;
              const Icon = stage.icon;

              return (
                <div key={stage.title} className="flex items-start gap-3.5">
                  <div className={`relative flex items-center justify-center w-8 h-8 rounded-xl border transition-all ${
                    isPast
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                      : isCurrent
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 animate-pulse ring-4 ring-amber-500/10'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-600'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-cyber font-bold ${
                      isCurrent ? 'text-amber-300' : isPast ? 'text-zinc-200' : 'text-zinc-500'
                    }`}>
                      {stage.title} {isCurrent && <span className="text-[10px] text-amber-400 ml-1 font-normal">(EM ANDAMENTO)</span>}
                    </p>
                    <p className="text-[11px] text-zinc-400 leading-tight mt-0.5">
                      {stage.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PIX Payment simulation if chosen */}
        {order.paymentMethod === 'pix' && (
          <div className="mt-6 p-4 rounded-2xl bg-zinc-900/60 border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between text-xs font-cyber">
              <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                <QrCode className="w-4 h-4" /> PAGAMENTO VIA PIX INSTANTÂNEO
              </span>
              <span className="text-zinc-400">Total: R$ {order.total.toFixed(2).replace('.', ',')}</span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={dummyPixCode}
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-[11px] font-mono text-zinc-400 truncate select-all"
              />
              <button
                onClick={handleCopyPix}
                className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-cyber font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                {copiedPix ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPix ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
            <p className="text-[10px] text-zinc-400">
              Chave simulada gerada. Confirmação instantânea automática pela rede bancária.
            </p>
          </div>
        )}

        {/* Order Details Summary */}
        <div className="mt-6 p-4 rounded-2xl bg-zinc-950 border border-zinc-800/80 text-xs space-y-2">
          <div className="flex justify-between text-zinc-400">
            <span>Cliente:</span>
            <span className="text-white font-medium">{order.customerName}</span>
          </div>
          <div className="flex justify-between text-zinc-400">
            <span>Método:</span>
            <span className="text-white font-medium">
              {order.deliveryMethod === 'delivery' ? 'Entrega em Domicílio' : 'Retirada na Bancada'}
            </span>
          </div>
          {order.deliveryMethod === 'delivery' && (
            <div className="flex justify-between text-zinc-400">
              <span>Endereço:</span>
              <span className="text-white font-medium text-right max-w-xs truncate">{order.address}</span>
            </div>
          )}
          <div className="flex justify-between text-zinc-400 pt-2 border-t border-zinc-900">
            <span>Itens:</span>
            <span className="text-white">{order.items.length} produto(s)</span>
          </div>
        </div>

        {/* Close & Return Button */}
        <div className="mt-6">
          <button
            onClick={() => {
              playCyberClick();
              onClose();
            }}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-cyber font-bold text-xs uppercase tracking-wider transition cursor-pointer"
          >
            Voltar ao Cardápio Vikings
          </button>
        </div>

      </div>
    </div>
  );
}
