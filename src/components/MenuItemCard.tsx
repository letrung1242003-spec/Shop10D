import { MenuItem } from "@/data/menu";
import { useStore } from "@/context/StoreContext";

interface MenuItemCardProps {
  item: MenuItem;
}

const MenuItemCard = ({ item }: MenuItemCardProps) => {
  const { addToCart, cart } = useStore();
  const inCart = cart.find(c => c.id === item.id);

  return (
    <div className="bg-card rounded-2xl p-4 kawaii-shadow hover:kawaii-shadow-lg transition-all duration-300 hover:-translate-y-1 bounce-in">
      <div className="text-5xl text-center mb-3 float-animation">{item.emoji}</div>
      <h3 className="font-bold text-foreground text-center text-sm">{item.name}</h3>
      <p className="text-muted-foreground text-xs text-center mt-1">{item.description}</p>
      <div className="flex items-center justify-between mt-3">
        <span className="font-extrabold text-primary text-sm">
          {item.price.toLocaleString("vi-VN")}đ
        </span>
        <button
          onClick={() => addToCart(item)}
          className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center text-lg font-bold hover:scale-110 transition-transform active:scale-95"
        >
          {inCart ? inCart.quantity : "+"}
        </button>
      </div>
    </div>
  );
};

export default MenuItemCard;
