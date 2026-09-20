import { useState, useRef } from 'react';
import { 
  Search, 
  Sparkles, 
  Flame, 
  Layers, 
  Filter, 
  ChevronRight, 
  Check, 
  Clock, 
  MapPin, 
  Phone, 
  Instagram, 
  MessageCircle,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Product, ProductCategory, ProductAddon, FoodLayer, CartItem, OrderDetails } from './types';
import { VIKINGS_PRODUCTS } from './data/products';
import { CyberBackground } from './components/CyberBackground';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FoodForge } from './components/FoodForge';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { playCyberClick, playCartAddSound } from './utils/audio';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  
  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Active product for customization modal
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);
  
  // Successful order state for tracking modal
  const [completedOrder, setCompletedOrder] = useState<OrderDetails | null>(null);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const menuSectionRef = useRef<HTMLDivElement>(null);
  const forgeSectionRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const scrollToMenu = () => {
    menuSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToForge = () => {
    forgeSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Filter & Sort Products
  const filteredProducts = VIKINGS_PRODUCTS.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesQuery = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.ingredients.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesQuery;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // featured default
  });

  // Quick add to cart
  const handleQuickAdd = (product: Product) => {
    const cartItemId = `${product.id}-${Date.now()}`;
    const newItem: CartItem = {
      cartItemId,
      product,
      quantity: 1,
      selectedAddons: [],
      removedIngredients: [],
      itemTotal: product.price,
    };
    setCartItems(prev => [...prev, newItem]);
    showToast(`+1 ${product.name} adicionado ao pedido!`);
  };

  // Add from Customization Modal
  const handleAddFromModal = (
    product: Product,
    quantity: number,
    selectedAddons: ProductAddon[],
    removedIngredients: string[],
    notes: string,
    itemTotal: number
  ) => {
    const cartItemId = `${product.id}-${Date.now()}`;
    const newItem: CartItem = {
      cartItemId,
      product,
      quantity,
      selectedAddons,
      removedIngredients,
      customNotes: notes,
      itemTotal,
    };
    setCartItems(prev => [...prev, newItem]);
    showToast(`+${quantity} ${product.name} personalizado adicionado!`);
  };

  // Add from 3D Food Forge
  const handleAddFromForge = (
    product: Product,
    layers: FoodLayer[],
    totalCustomPrice: number
  ) => {
    const removed = layers.filter(l => !l.selected).map(l => l.name);
    const cartItemId = `forge-${product.id}-${Date.now()}`;
    const newItem: CartItem = {
      cartItemId,
      product: {
        ...product,
        name: `${product.name} (Custom Forja 3D)`,
      },
      quantity: 1,
      selectedAddons: [],
      removedIngredients: removed,
      customNotes: `Montado na Forja 3D com ${layers.filter(l => l.selected).length} camadas ativas`,
      itemTotal: totalCustomPrice,
    };
    setCartItems(prev => [...prev, newItem]);
    showToast(`Receita customizada da Forja 3D adicionada!`);
  };

  const handleUpdateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    setCartItems(prev => prev.map(item => {
      if (item.cartItemId === cartItemId) {
        const unitPrice = item.itemTotal / item.quantity;
        return {
          ...item,
          quantity: newQty,
          itemTotal: unitPrice * newQty,
        };
      }
      return item;
    }));
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#090b0e] text-[#e8ebf0] selection:bg-amber-500 selection:text-black relative">
      
      {/* Dynamic Cyber Canvas & Ambient Lighting */}
      <CyberBackground />

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl bg-zinc-950/95 border border-amber-500/60 shadow-2xl backdrop-blur-xl text-white text-xs font-cyber animate-bounce">
          <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
            <Check className="w-4 h-4" />
          </span>
          <span className="font-bold tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* Header / Navigation */}
      <Navbar
        activeCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          scrollToMenu();
        }}
        onOpenForge={scrollToForge}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="relative z-10">
        
        {/* Hero Section */}
        <HeroSection
          onExploreClick={scrollToMenu}
          onOpenForge={scrollToForge}
        />

        {/* 3D Food Forge Highlight Section */}
        <section ref={forgeSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          <FoodForge onAddToCart={handleAddFromForge} />
        </section>

        {/* Menu Section */}
        <section ref={menuSectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-zinc-800">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-cyber mb-2">
                <Flame className="w-3.5 h-3.5" /> CARDÁPIO TECNOLÓGICO
              </div>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white">
                Escolha Sua Especialidade
              </h2>
              <p className="text-sm text-zinc-400 mt-1 max-w-xl">
                Todos os pratos são preparados na hora com ingredientes frescos, pães selados e fritura dourada em óleo purificado.
              </p>
            </div>

            {/* Search & Sort Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Search Box */}
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar hambúrguer, pastel..."
                  className="w-full bg-zinc-900/80 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition"
                />
              </div>

              {/* Sort Selector */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="bg-zinc-900/80 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs font-cyber text-zinc-300 focus:outline-none focus:border-amber-500 cursor-pointer appearance-none pr-8"
                >
                  <option value="featured">Destaques da Chapa</option>
                  <option value="price-asc">Menor Preço</option>
                  <option value="price-desc">Maior Preço</option>
                  <option value="rating">Mais Bem Avaliados</option>
                </select>
                <Filter className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Interactive Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto py-6 no-scrollbar">
            <button
              onClick={() => {
                playCyberClick();
                setSelectedCategory('all');
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-cyber font-bold tracking-wide whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
                selectedCategory === 'all'
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                  : 'bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Todos os Sabores ({VIKINGS_PRODUCTS.length})</span>
            </button>

            <button
              onClick={() => {
                playCyberClick();
                setSelectedCategory('burger');
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-cyber font-bold tracking-wide whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
                selectedCategory === 'burger'
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                  : 'bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
            >
              <span>🍔 Hambúrgueres Smash (3)</span>
            </button>

            <button
              onClick={() => {
                playCyberClick();
                setSelectedCategory('pastel');
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-cyber font-bold tracking-wide whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
                selectedCategory === 'pastel'
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                  : 'bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
            >
              <span>🥟 Pastéis Crocantes 25cm (3)</span>
            </button>

            <button
              onClick={() => {
                playCyberClick();
                setSelectedCategory('hotdog');
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-cyber font-bold tracking-wide whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
                selectedCategory === 'hotdog'
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                  : 'bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
            >
              <span>🌭 Cachorros-Quentes Prensados (3)</span>
            </button>

            <button
              onClick={() => {
                playCyberClick();
                setSelectedCategory('combo');
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-cyber font-bold tracking-wide whitespace-nowrap transition cursor-pointer flex items-center gap-2 ${
                selectedCategory === 'combo'
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                  : 'bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
            >
              <span>👑 Combos dos Guerreiros (2)</span>
            </button>
          </div>

          {/* Product Cards Grid with Holographic Tilt */}
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center space-y-3 bg-zinc-900/30 rounded-3xl border border-zinc-800/60">
              <Search className="w-10 h-10 text-zinc-600 mx-auto" />
              <p className="font-cyber font-bold text-lg text-white">Nenhum item encontrado</p>
              <p className="text-xs text-zinc-400">Tente buscar por outro termo ou limpe os filtros.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 text-black text-xs font-cyber font-bold cursor-pointer"
              >
                Ver Todos os Produtos
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={(p) => setActiveModalProduct(p)}
                  onQuickAdd={(p) => handleQuickAdd(p)}
                />
              ))}
            </div>
          )}

        </section>

        {/* Quality Banner / Guarantees */}
        <section className="border-t border-b border-zinc-800/80 bg-zinc-950/60 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-cyber font-bold text-sm text-white uppercase tracking-wider">
                    Chapa a 300°C com Reação Maillard
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Carne Angus com crostinha crocante, caramelização de açúcares naturais e retenção de todo o suco interno.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-cyber font-bold text-sm text-white uppercase tracking-wider">
                    Massa de Pastel com Cachaça Artesanal
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Fórmula secreta que cria microbolhas puras e estaladiças sem absorver gordura excessiva.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-cyber font-bold text-sm text-white uppercase tracking-wider">
                    Embalagem Térmica Anti-Vapor
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Caixas ventiladas com tecnologia de respirador para garantir que o pastel chegue crocante e o burger quente.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 bg-[#06080a] text-zinc-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-xl text-amber-400">VIKINGS</span>
                <span className="font-cyber font-bold text-sm text-zinc-300">FOODS</span>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Cyber Gastronomia Artesanal. Hambúrgueres smash, pastéis de 25cm e cachorros-quentes prensados no ferro.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <h5 className="font-cyber font-bold text-white uppercase tracking-wider">Horários da Chapa</h5>
              <p className="text-zinc-400">Segunda a Quinta: 18h às 23h30</p>
              <p className="text-zinc-400">Sexta e Sábado: 18h às 02h00</p>
              <p className="text-amber-400 font-bold">Domingo: 18h às 00h00</p>
            </div>

            <div className="space-y-2 text-xs">
              <h5 className="font-cyber font-bold text-white uppercase tracking-wider">Unidade Valhalla</h5>
              <p className="flex items-center gap-1.5 text-zinc-400">
                <MapPin className="w-3.5 h-3.5 text-amber-400" /> Av. Paulista, 1000 - São Paulo, SP
              </p>
              <p className="flex items-center gap-1.5 text-zinc-400">
                <Phone className="w-3.5 h-3.5 text-amber-400" /> (11) 3344-5566 / WhatsApp
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <h5 className="font-cyber font-bold text-white uppercase tracking-wider">Conecte-se</h5>
              <div className="flex items-center gap-3 pt-1">
                <a href="#instagram" className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-amber-400 transition">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#whatsapp" className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-emerald-400 transition">
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
              <p className="text-[11px] text-zinc-500 pt-1">
                © 2026 Vikings Foods. Todos os direitos reservados.
              </p>
            </div>
          </div>

        </div>
      </footer>

      {/* Product Customization Modal */}
      {activeModalProduct && (
        <ProductModal
          product={activeModalProduct}
          onClose={() => setActiveModalProduct(null)}
          onAddToCart={handleAddFromModal}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckoutSuccess={(order) => {
          setIsCartOpen(false);
          setCartItems([]);
          setCompletedOrder(order);
        }}
      />

      {/* Order Success / Live Tracking Modal */}
      {completedOrder && (
        <OrderSuccessModal
          order={completedOrder}
          onClose={() => setCompletedOrder(null)}
        />
      )}

    </div>
  );
}
