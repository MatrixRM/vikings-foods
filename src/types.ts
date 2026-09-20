export type ProductCategory = 'all' | 'burger' | 'pastel' | 'hotdog' | 'combo';

export interface ProductAddon {
  id: string;
  name: string;
  price: number;
}

export interface FoodLayer {
  id: string;
  name: string;
  category: 'bun' | 'meat' | 'cheese' | 'sauce' | 'veg' | 'crispy' | 'pastry';
  color: string;
  description: string;
  calories: number;
  selected: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: 'burger' | 'pastel' | 'hotdog' | 'combo';
  tagline: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  badge?: string;
  rating: number;
  reviewCount: number;
  prepTime: string;
  calories: number;
  temperature: string;
  spiciness: number; // 0 to 3
  ingredients: string[];
  addons: ProductAddon[];
  layers?: FoodLayer[];
}

export interface CartItem {
  cartItemId: string;
  product: Product;
  quantity: number;
  selectedAddons: ProductAddon[];
  removedIngredients: string[];
  customNotes?: string;
  itemTotal: number;
}

export interface OrderDetails {
  orderId: string;
  customerName: string;
  customerPhone: string;
  deliveryMethod: 'delivery' | 'pickup';
  address: string;
  paymentMethod: 'pix' | 'card' | 'cash';
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  estimatedMinutes: number;
  createdAt: string;
}
