import { useState } from "react";
import { Link } from "react-router-dom";
import { MENU_ITEMS } from "@/data/menu";
import { useStore } from "@/context/StoreContext";
import MenuItemCard from "@/components/MenuItemCard";
import CartDrawer from "@/components/CartDrawer";

const Index = () => {
  const { cartCount, menuItems } = useStore();
  const [category, setCategory] = useState("Tất cả");
  const [cartOpen, setCartOpen] = useState(false);

  const categories = ["Tất cả", ...Array.from(new Set(menuItems.map(i => i.category)))];
  const filtered = category === "Tất cả" ? menuItems : menuItems.filter(i => i.category === category);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-foreground">🍩 Tiệm Ngon</h1>
            <p className="text-xs text-muted-foreground">Đặt món ngay tại trường!</p>
          </div>
          <button
            onClick={() => setCartOpen(true)}
            className="relative bg-primary text-primary-foreground rounded-full px-4 py-2 font-bold text-sm hover:opacity-90 transition-opacity"
          >
            🛒 Giỏ hàng
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-extrabold bounce-in">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Banner */}
      <div className="max-w-lg mx-auto px-4 mt-4">
        <div className="bg-gradient-to-r from-kawaii-pink to-kawaii-peach rounded-2xl p-5 kawaii-shadow">
          <p className="text-2xl font-extrabold text-foreground">Chào bạn! 👋</p>
          <p className="text-sm text-foreground/70 mt-1">Hôm nay ăn gì nè? Chọn món yêu thích nhé ✨</p>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-lg mx-auto px-4 mt-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                category === cat
                  ? "bg-primary text-primary-foreground kawaii-shadow"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="max-w-lg mx-auto px-4 mt-4">
        <div className="grid grid-cols-2 gap-3">
          {filtered.map(item => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Footer nav to seller */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/80 backdrop-blur-md border-t border-border py-3 px-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <span className="text-xs text-muted-foreground">🛍️ Trang khách hàng</span>
          <Link
            to="/seller"
            className="bg-secondary text-secondary-foreground rounded-full px-4 py-2 text-xs font-bold hover:opacity-90 transition-opacity"
          >
            👨‍🍳 Chuyển sang trang người bán →
          </Link>
        </div>
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default Index;
