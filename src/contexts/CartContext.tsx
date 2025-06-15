"use client";

import { createContext, useContext, useEffect, useState } from 'react';

interface Package {
  id: string;
  name: string;
  price: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  details: string;
  price: number;
  image: string;
  packages: Package[];
  category: string;
  inStock: boolean;
}

interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  packages: Package[];
  selectedPackage: string;
  totalPrice: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity: number, selectedPackage: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updatePackage: (id: string, packageId: string) => void;
  clearCart: () => void;
  getItemPrice: (item: CartItem) => number;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart) && parsedCart.every(validateCartItem)) {
          setItems(parsedCart);
        } else {
          console.error('Invalid cart data structure');
          localStorage.removeItem('cart');
        }
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      localStorage.removeItem('cart');
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }, [items]);

  const validateCartItem = (item: any): item is CartItem => {
    return (
      typeof item === 'object' &&
      typeof item.id === 'string' &&
      typeof item.name === 'string' &&
      typeof item.description === 'string' &&
      typeof item.price === 'number' &&
      typeof item.quantity === 'number' &&
      typeof item.image === 'string' &&
      typeof item.category === 'string' &&
      Array.isArray(item.packages) &&
      typeof item.selectedPackage === 'string' &&
      typeof item.totalPrice === 'number'
    );
  };

  const getItemPrice = (item: CartItem) => {
    const selectedPkg = item.packages.find(pkg => pkg.id === item.selectedPackage);
    return selectedPkg ? selectedPkg.price : item.price;
  };

  const calculateItemTotal = (item: CartItem) => {
    return getItemPrice(item) * item.quantity;
  };

  const addItem = (product: Product, quantity: number, selectedPackage: string) => {
    setItems(currentItems => {
      const existingItemIndex = currentItems.findIndex(item => 
        item.id === product.id && item.selectedPackage === selectedPackage
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...currentItems];
        const existingItem = updatedItems[existingItemIndex];
        const newQuantity = existingItem.quantity + quantity;
        const newTotalPrice = getItemPrice(existingItem) * newQuantity;
        
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
          totalPrice: newTotalPrice
        };
        
        return updatedItems;
      }

      const cartItem: CartItem = {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        quantity,
        image: product.image,
        category: product.category,
        packages: product.packages,
        selectedPackage,
        totalPrice: 0
      };

      cartItem.totalPrice = getItemPrice(cartItem) * quantity;

      return [...currentItems, cartItem];
    });
  };

  const removeItem = (id: string) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    
    setItems(currentItems =>
      currentItems.map(item => {
        if (item.id === id) {
          const newTotalPrice = getItemPrice(item) * quantity;
          return { ...item, quantity, totalPrice: newTotalPrice };
        }
        return item;
      })
    );
  };

  const updatePackage = (id: string, packageId: string) => {
    setItems(currentItems =>
      currentItems.map(item => {
        if (item.id === id) {
          const newPrice = getItemPrice({ ...item, selectedPackage: packageId });
          const newTotalPrice = newPrice * item.quantity;
          return { ...item, selectedPackage: packageId, totalPrice: newTotalPrice };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('cart');
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + item.totalPrice, 0);
  };

  const getCartCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      updatePackage,
      clearCart,
      getItemPrice,
      getCartTotal,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}