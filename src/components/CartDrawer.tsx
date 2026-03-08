import { useStore } from "@/context/StoreContext";
import { useState } from "react";
import { toast } from "sonner";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CartDrawer = ({ open, onClose }: CartDrawerProps) => {
  const { cart, updateQuantity, removeFromCart, cartTotal, placeOrder, qrCodeUrl } = useStore();
  const [name, setName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "transfer">("cash");
  const [showQR, setShowQR] = useState(false);

  const handleOrder = () => {
    if (!name.trim()) {
      toast.error("Nhập tên để đặt hàng nhé! 🥺");
      return;
    }
    if (cart.length === 0) {
      toast.error("Giỏ hàng trống rồi! 🛒");
      return;
    }
    
    if (paymentMethod === "transfer" && !showQR) {
      setShowQR(true);
      return;
    }

    placeOrder(name.trim(), paymentMethod);
    setName("");
    setPaymentMethod("cash");
    setShowQR(false);
    toast.success("Đặt hàng thành công! 🎉");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div className="ml-auto w-full max-w-sm bg-card h-full relative z-10 p-5 flex flex-col bounce-in overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-extrabold text-foreground">🛒 Giỏ hàng</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-2xl">✕</button>
        </div>

        {cart.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground text-center">Chưa có món nào 🥺<br />Thêm món ngon nhé!</p>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-3">
              {cart.map(item => (
                <div key={item.id} className="flex items-center gap-3 bg-muted rounded-xl p-3">
                  <span className="text-2xl">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-foreground truncate">{item.name}</p>
                    <p className="text-xs text-primary font-bold">{(item.price * item.quantity).toLocaleString("vi-VN")}đ</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-sm hover:bg-primary/20">−</button>
                    <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-sm hover:bg-primary/20">+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-destructive hover:text-destructive/80 text-sm">🗑</button>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-border space-y-4">
              <div className="flex justify-between font-extrabold text-lg">
                <span>Tổng</span>
                <span className="text-primary">{cartTotal.toLocaleString("vi-VN")}đ</span>
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase">Thông tin khách hàng</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Tên của bạn ✨"
                  className="w-full px-4 py-3 rounded-xl bg-muted text-foreground placeholder:text-muted-foreground font-semibold text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase">Hình thức thanh toán</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { setPaymentMethod("cash"); setShowQR(false); }}
                    className={`py-2 px-3 rounded-xl border-2 text-sm font-bold transition-all ${paymentMethod === "cash" ? "border-primary bg-primary/5 text-primary" : "border-transparent bg-muted text-muted-foreground"}`}
                  >
                    💵 Tiền mặt
                  </button>
                  <button
                    onClick={() => setPaymentMethod("transfer")}
                    className={`py-2 px-3 rounded-xl border-2 text-sm font-bold transition-all ${paymentMethod === "transfer" ? "border-primary bg-primary/5 text-primary" : "border-transparent bg-muted text-muted-foreground"}`}
                  >
                    🏦 Chuyển khoản
                  </button>
                </div>
              </div>

              {showQR && paymentMethod === "transfer" && (
                <div className="bg-white p-4 rounded-2xl flex flex-col items-center gap-3 border-2 border-dashed border-primary/30 bounce-in">
                  <p className="text-xs font-bold text-foreground text-center">Quét mã để thanh toán</p>
                  <img 
                    src={qrCodeUrl.includes("vietqr.io") ? `${qrCodeUrl}?amount=${cartTotal}&addInfo=Don hang ${name}` : qrCodeUrl} 
                    alt="QR Thanh toán" 
                    className="w-48 h-48 rounded-lg shadow-md"
                  />
                  <p className="text-[10px] text-muted-foreground italic text-center">Nội dung: Don hang {name}</p>
                </div>
              )}

              <button
                onClick={handleOrder}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-extrabold text-base hover:opacity-90 transition-opacity active:scale-[0.98] shadow-lg"
              >
                {showQR ? "Xác nhận đã chuyển 🎉" : "Đặt hàng 🎉"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
