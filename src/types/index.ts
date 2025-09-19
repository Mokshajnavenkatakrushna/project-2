export interface User {
  id: string;
  name: string;
  email: string;
  language: 'en' | 'hi' | 'te';
  createdAt: string;
}

export interface SoilData {
  id: string;
  userId: string;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  pH: number;
  moisture: number;
  date: string;
  recommendations: string[];
  cropSuggestions: string[];
  status: 'excellent' | 'good' | 'fair' | 'poor';
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  compatibility: string[];
  inStock: boolean;
  rating: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

export interface Order {
  _id: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'cod' | 'card' | 'upi' | 'netbanking' | 'wallet';
  shippingAddress: ShippingAddress;
  paymentDetails?: {
    transactionId?: string;
    paymentGateway?: string;
    paidAt?: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Language {
  code: 'en' | 'hi' | 'te';
  name: string;
  flag: string;
}