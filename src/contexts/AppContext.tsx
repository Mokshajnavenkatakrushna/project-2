import React, { createContext, useContext, useState, useEffect } from 'react';
import { SoilData, Product, CartItem, Order } from '../types';
import { soilAnalysisApi, orderApi } from '../services/api';
import { useAuth } from './AuthContext';

interface AppContextType {
  soilHistory: SoilData[];
  addSoilData: (data: Omit<SoilData, 'id' | 'userId' | 'date'>) => Promise<boolean>;
  loadUserSoilHistory: () => Promise<void>;
  orderHistory: Order[];
  addOrder: (order: Order) => void;
  loadUserOrders: () => Promise<void>;
  isLoadingData: boolean;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (undefined === context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [soilHistory, setSoilHistory] = useState<SoilData[]>([]);
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  // Load user data when user changes
  useEffect(() => {
    if (user) {
      setIsLoadingData(true);
      
      // First try to load from localStorage for immediate display
      const savedOrders = localStorage.getItem(`orderHistory_${user.id}`);
      const savedSoil = localStorage.getItem(`soilHistory_${user.id}`);
      
      if (savedOrders) {
        setOrderHistory(JSON.parse(savedOrders));
      }
      if (savedSoil) {
        setSoilHistory(JSON.parse(savedSoil));
      }
      
      // Then load from database to ensure we have the latest data
      Promise.all([loadUserOrders(), loadUserSoilHistory()]).finally(() => {
        setIsLoadingData(false);
      });
    } else {
      setOrderHistory([]);
      setSoilHistory([]);
      setIsLoadingData(false);
    }
  }, [user]);

  const addSoilData = async (data: Omit<SoilData, 'id' | 'userId' | 'date'>): Promise<boolean> => {
    if (!user) {
      console.error('User not authenticated');
      return false;
    }

    try {
      const response = await soilAnalysisApi.createAnalysis({
        userId: user.id,
        ...data
      });

      const newSoilData: SoilData = {
        ...data,
        id: response.data._id,
        userId: user.id,
        date: response.data.date || new Date().toISOString(),
      };
      
      setSoilHistory(prev => [newSoilData, ...prev]);
      // Save to localStorage as backup
      if (user) {
        const updatedHistory = [newSoilData, ...soilHistory];
        localStorage.setItem(`soilHistory_${user.id}`, JSON.stringify(updatedHistory));
      }
      return true;
    } catch (error) {
      console.error('Failed to save soil analysis:', error);
      return false;
    }
  };

  const addOrder = (order: Order) => {
    setOrderHistory(prev => [order, ...prev]);
    // Save to localStorage as backup
    if (user) {
      const updatedHistory = [order, ...orderHistory];
      localStorage.setItem(`orderHistory_${user.id}`, JSON.stringify(updatedHistory));
    }
  };

  const loadUserOrders = async () => {
    if (!user) return;

    try {
      const response = await orderApi.getUserOrders(user.id);
      setOrderHistory(response.data);
      // Save to localStorage as backup
      localStorage.setItem(`orderHistory_${user.id}`, JSON.stringify(response.data));
    } catch (error) {
      console.error('Failed to load user orders:', error);
      // Try to load from localStorage as fallback
      const savedData = localStorage.getItem(`orderHistory_${user.id}`);
      if (savedData) {
        setOrderHistory(JSON.parse(savedData));
      }
    }
  };

  const loadUserSoilHistory = async () => {
    if (!user) return;

    try {
      const response = await soilAnalysisApi.getUserAnalyses(user.id);
      setSoilHistory(response.data);
      // Save to localStorage as backup
      localStorage.setItem(`soilHistory_${user.id}`, JSON.stringify(response.data));
    } catch (error) {
      console.error('Failed to load user soil history:', error);
      // Try to load from localStorage as fallback
      const savedData = localStorage.getItem(`soilHistory_${user.id}`);
      if (savedData) {
        setSoilHistory(JSON.parse(savedData));
      }
    }
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.product.id === product.id);
      if (existingItem) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => 
      prev.map(item => 
        item.product.id === productId 
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <AppContext.Provider value={{
      soilHistory,
      addSoilData,
      loadUserSoilHistory,
      orderHistory,
      addOrder,
      loadUserOrders,
      isLoadingData,
      cart,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      sidebarOpen,
      setSidebarOpen
    }}>
      {children}
    </AppContext.Provider>
  );
};