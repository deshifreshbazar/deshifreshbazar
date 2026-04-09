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

type RawCartItem = Partial<CartItem> & {
  category?: string | { name?: string } | null;
};

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, quantity: number, selectedPackage: string) => void;
  removeItem: (id: string, selectedPackage?: string) => void;
  updateQuantity: (id: string, quantity: number, selectedPackage?: string) => void;
  updatePackage: (id: string, packageId: string, selectedPackage?: string) => void;
  clearCart: () => void;
  getItemPrice: (item: CartItem) => number;
  getCartTotal: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Refactored cart load/save logic and validation

  // Helper to migrate/validate a single cart item
  const migrateCartItem = (item: RawCartItem): CartItem => {
    const migratedPackages = Array.isArray(item?.packages)
      ? item.packages
          .filter(
            (pkg): pkg is Package =>
              Boolean(pkg) &&
              typeof pkg.id === 'string' &&
              typeof pkg.name === 'string' &&
              typeof pkg.price === 'number'
          )
          .map(pkg => ({
            id: pkg.id,
            name: pkg.name,
            price: pkg.price,
          }))
      : [];

    const selectedPackage =
      typeof item?.selectedPackage === 'string' && item.selectedPackage
        ? item.selectedPackage
        : (migratedPackages[0]?.id ?? '');

    const resolvedPrice =
      migratedPackages.find(pkg => pkg.id === selectedPackage)?.price ??
      (typeof item?.price === 'number' ? item.price : 0);

    const quantity =
      typeof item?.quantity === 'number' && Number.isFinite(item.quantity) && item.quantity > 0
        ? Math.floor(item.quantity)
        : 1;

    const normalizedCategory =
      typeof item?.category === 'string'
        ? item.category
        : (
            item?.category &&
            typeof item.category === 'object' &&
            'name' in item.category &&
            typeof (item.category as { name?: unknown }).name === 'string'
          )
          ? ((item.category as { name: string }).name)
          : '';

    return {
      id: typeof item?.id === 'string' ? item.id : '',
      name: typeof item?.name === 'string' ? item.name : '',
      description: typeof item?.description === 'string' ? item.description : '',
      price: typeof item?.price === 'number' ? item.price : 0,
      quantity,
      image: typeof item?.image === 'string' ? item.image : '',
      category: normalizedCategory,
      packages: migratedPackages,
      selectedPackage,
      totalPrice: resolvedPrice * quantity,
    };
  };

  // Validate a cart item
  const validateCartItem = (item: CartItem): item is CartItem => (
    item &&
    typeof item.id === 'string' &&
    typeof item.name === 'string' &&
    typeof item.description === 'string' &&
    typeof item.price === 'number' &&
    typeof item.quantity === 'number' &&
    typeof item.image === 'string' &&
    typeof item.category === 'string' &&
    Array.isArray(item.packages) &&
    item.packages.every(
      pkg =>
        pkg &&
        typeof pkg.id === 'string' &&
        typeof pkg.name === 'string' &&
        typeof pkg.price === 'number'
    ) &&
    typeof item.selectedPackage === 'string' &&
    typeof item.totalPrice === 'number'
  );

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (!savedCart) return;

      const parsedCart = JSON.parse(savedCart);
      if (!Array.isArray(parsedCart)) {
        throw new Error('Invalid cart data structure');
      }

      const migratedCart = parsedCart.map(migrateCartItem);
      if (migratedCart.every(validateCartItem)) {
        setItems(migratedCart);
      } else {
        throw new Error('Invalid cart item(s) in cart');
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      localStorage.removeItem('cart');
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart:', error);
    }
  }, [items]);

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

  const removeItem = (id: string, selectedPackage?: string) => {
    setItems(currentItems =>
      currentItems.filter(
        item => !(item.id === id && (selectedPackage ? item.selectedPackage === selectedPackage : true))
      )
    );
  };

  const updateQuantity = (id: string, quantity: number, selectedPackage?: string) => {
    if (quantity < 1) return;
    
    setItems(currentItems =>
      currentItems.map(item => {
        const matchesItem = item.id === id && (selectedPackage ? item.selectedPackage === selectedPackage : true);
        if (matchesItem) {
          const newTotalPrice = getItemPrice(item) * quantity;
          return { ...item, quantity, totalPrice: newTotalPrice };
        }
        return item;
      })
    );
  };

  const updatePackage = (id: string, packageId: string, selectedPackage?: string) => {
    setItems(currentItems =>
      currentItems.map(item => {
        const matchesItem = item.id === id && (selectedPackage ? item.selectedPackage === selectedPackage : true);
        if (matchesItem) {
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
