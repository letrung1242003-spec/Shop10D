import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { CartItem, MenuItem, Order } from "@/data/menu";

interface StoreContextType {
  cart: CartItem[];
  orders: Order[];
  menuItems: MenuItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (customerName: string, paymentMethod: "cash" | "transfer") => void;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  updateMenuItem: (item: MenuItem) => void;
  addMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (id: string) => void;
  sellerPassword: string;
  updateSellerPassword: (password: string) => void;
  qrCodeUrl: string;
  updateQrCodeUrl: (url: string) => void;
  cartTotal: number;
  cartCount: number;
}

const StoreContext = createContext<StoreContextType | null>(null);

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
};

const loadOrders = (): Order[] => {
  try {
    const saved = localStorage.getItem("kawaii-orders");
    return saved ? JSON.parse(saved) : [];
  } catch { return []; }
};

const saveOrders = (orders: Order[]) => {
  localStorage.setItem("kawaii-orders", JSON.stringify(orders));
};

const loadMenu = (): MenuItem[] => {
  try {
    const saved = localStorage.getItem("kawaii-menu");
    return saved ? JSON.parse(saved) : [];
  } catch { 
    return []; 
  }
};

const saveMenu = (menu: MenuItem[]) => {
  localStorage.setItem("kawaii-menu", JSON.stringify(menu));
};

const loadSellerPassword = (): string => {
  return localStorage.getItem("kawaii-seller-password") || "1234";
};

const loadQrCodeUrl = (): string => {
  return localStorage.getItem("kawaii-qr-code-url") || "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=example";
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(loadOrders);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [sellerPassword, setSellerPassword] = useState<string>(loadSellerPassword);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>(loadQrCodeUrl);

  useEffect(() => {
    // Load menu from localStorage or default data
    const savedMenu = localStorage.getItem("kawaii-menu");
    if (savedMenu) {
      setMenuItems(JSON.parse(savedMenu));
    } else {
      // Use the pre-imported MENU_ITEMS as fallback
      import("@/data/menu").then(mod => {
        setMenuItems(mod.MENU_ITEMS);
      });
    }
  }, []);

  const addToCart = useCallback((item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) {
        return prev.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart(prev => prev.filter(c => c.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(c => c.id !== id));
    } else {
      setCart(prev => prev.map(c => c.id === id ? { ...c, quantity } : c));
    }
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const placeOrder = useCallback((customerName: string, paymentMethod: "cash" | "transfer") => {
    const newOrder: Order = {
      id: Date.now().toString(),
      items: [...cart],
      customerName,
      total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
      status: "pending",
      paymentMethod,
      createdAt: new Date().toLocaleString("vi-VN"),
    };
    const updated = [newOrder, ...orders];
    setOrders(updated);
    saveOrders(updated);
    setCart([]);
  }, [cart, orders]);

  const updateOrderStatus = useCallback((orderId: string, status: Order["status"]) => {
    setOrders(prev => {
      const updated = prev.map(o => o.id === orderId ? { ...o, status } : o);
      saveOrders(updated);
      return updated;
    });
  }, []);

  const updateMenuItem = useCallback((item: MenuItem) => {
    setMenuItems(prev => {
      const updated = prev.map(i => i.id === item.id ? item : i);
      saveMenu(updated);
      return updated;
    });
  }, []);

  const addMenuItem = useCallback((item: MenuItem) => {
    setMenuItems(prev => {
      const updated = [...prev, item];
      saveMenu(updated);
      return updated;
    });
  }, []);

  const deleteMenuItem = useCallback((id: string) => {
    setMenuItems(prev => {
      const updated = prev.filter(i => i.id !== id);
      saveMenu(updated);
      return updated;
    });
  }, []);

  const updateSellerPassword = useCallback((password: string) => {
    setSellerPassword(password);
    localStorage.setItem("kawaii-seller-password", password);
  }, []);

  const updateQrCodeUrl = useCallback((url: string) => {
    setQrCodeUrl(url);
    localStorage.setItem("kawaii-qr-code-url", url);
  }, []);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <StoreContext.Provider value={{
      cart, orders, menuItems, addToCart, removeFromCart, updateQuantity,
      clearCart, placeOrder, updateOrderStatus, updateMenuItem, addMenuItem, deleteMenuItem,
      sellerPassword, updateSellerPassword, qrCodeUrl, updateQrCodeUrl,
      cartTotal, cartCount,
    }}>
      {children}
    </StoreContext.Provider>
  );
};
