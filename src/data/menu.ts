export interface MenuItem {
  id: string;
  name: string;
  price: number;
  emoji: string;
  category: string;
  description: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
  note?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  customerName: string;
  total: number;
  status: "pending" | "preparing" | "done";
  paymentMethod?: "cash" | "transfer";
  createdAt: string;
}

export const MENU_ITEMS: MenuItem[] = [
  { id: "1", name: "Trà ỔI", price: 15000, emoji: "🧋", category: "Đồ uống", description: "Trà ổi thơm ngon" },
  { id: "2", name: "Xoài lắc", price: 15000, emoji: "🥭", category: "Đồ ăn", description: "Xoài lắc đẫm gia vị" },
  { id: "3", name: "Bánh Tráng Bì Tự Trộn", price: 15000, emoji: "🥗", category: "Ăn vặt", description: "Bánh tráng trộn đủ vị chua cay" },
];
