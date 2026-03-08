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
  { id: "1", name: "Trà Sữa Trân Châu", price: 25000, emoji: "🧋", category: "Đồ uống", description: "Trà sữa thơm ngon với trân châu dai" },
  { id: "2", name: "Bánh Mì Thịt", price: 20000, emoji: "🥖", category: "Đồ ăn", description: "Bánh mì giòn kẹp thịt đầy đặn" },
  { id: "3", name: "Xôi Gà", price: 18000, emoji: "🍚", category: "Đồ ăn", description: "Xôi dẻo với gà xé sợi" },
  { id: "4", name: "Nước Cam Ép", price: 15000, emoji: "🍊", category: "Đồ uống", description: "Nước cam tươi nguyên chất" },
  { id: "5", name: "Bánh Tráng Trộn", price: 15000, emoji: "🥗", category: "Ăn vặt", description: "Bánh tráng trộn đủ vị chua cay" },
  { id: "6", name: "Cơm Chiên", price: 25000, emoji: "🍳", category: "Đồ ăn", description: "Cơm chiên dương châu thơm lừng" },
  { id: "7", name: "Trà Đào", price: 20000, emoji: "🍑", category: "Đồ uống", description: "Trà đào cam sả mát lạnh" },
  { id: "8", name: "Bánh Bông Lan", price: 12000, emoji: "🧁", category: "Ăn vặt", description: "Bánh bông lan trứng muối mềm xốp" },
  { id: "9", name: "Mì Xào", price: 22000, emoji: "🍜", category: "Đồ ăn", description: "Mì xào giòn với rau và thịt" },
  { id: "10", name: "Sữa Chua Đá", price: 12000, emoji: "🍨", category: "Đồ uống", description: "Sữa chua đá thơm mát" },
];
