import { useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "@/context/StoreContext";
import { Order, MenuItem } from "@/data/menu";
import { toast } from "sonner";

const SELLER_PASSWORD = "1234"; // This can be removed later if not used

const statusConfig: Record<Order["status"], { label: string; emoji: string; bg: string }> = {
  pending: { label: "Chờ làm", emoji: "⏳", bg: "bg-kawaii-yellow" },
  preparing: { label: "Đang làm", emoji: "👨‍🍳", bg: "bg-kawaii-mint" },
  done: { label: "Xong!", emoji: "✅", bg: "bg-kawaii-lavender" },
};

const nextStatus: Record<Order["status"], Order["status"] | null> = {
  pending: "preparing",
  preparing: "done",
  done: null,
};

const SellerPage = () => {
  const { sellerPassword } = useStore();
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="bg-card rounded-2xl p-6 kawaii-shadow w-full max-w-sm text-center space-y-4">
          <p className="text-4xl">🔒</p>
          <h2 className="text-lg font-extrabold text-foreground">Trang dành cho người bán</h2>
          <p className="text-sm text-muted-foreground">Nhập mật khẩu để tiếp tục</p>
          <input
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(false); }}
            onKeyDown={e => {
              if (e.key === "Enter") {
                if (password === sellerPassword) setAuthenticated(true);
                else setError(true);
              }
            }}
            placeholder="Mật khẩu..."
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {error && <p className="text-xs text-destructive font-semibold">Sai mật khẩu, thử lại nhé! 😅</p>}
          <button
            onClick={() => {
              if (password === sellerPassword) setAuthenticated(true);
              else setError(true);
            }}
            className="w-full bg-primary text-primary-foreground rounded-full py-3 font-bold text-sm hover:opacity-90 transition-opacity"
          >
            Vào trang quản lý
          </button>
          <Link to="/" className="block text-xs text-muted-foreground hover:text-primary transition-colors">
            ← Quay lại trang mua hàng
          </Link>
        </div>
      </div>
    );
  }

  return <SellerDashboard />;
};

const SellerDashboard = () => {
  const { 
    orders, updateOrderStatus, menuItems, updateMenuItem, addMenuItem, deleteMenuItem,
    sellerPassword, updateSellerPassword, qrCodeUrl, updateQrCodeUrl 
  } = useStore();
  const [activeTab, setActiveTab] = useState<"orders" | "menu" | "settings">("orders");
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [newPassword, setNewPassword] = useState(sellerPassword);
  const [newQrUrl, setNewQrUrl] = useState(qrCodeUrl);

  const handleNext = (order: Order) => {
    const next = nextStatus[order.status];
    if (next) {
      updateOrderStatus(order.id, next);
      toast.success(`Đơn #${order.id.slice(-4)} → ${statusConfig[next].label} ${statusConfig[next].emoji}`);
    }
  };

  const handleSaveMenu = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const item: MenuItem = {
      id: editingItem?.id || Date.now().toString(),
      name: formData.get("name") as string,
      price: Number(formData.get("price")),
      emoji: formData.get("emoji") as string,
      category: formData.get("category") as string,
      description: formData.get("description") as string,
    };

    if (editingItem) {
      updateMenuItem(item);
      toast.success("Cập nhật món thành công! ✨");
    } else {
      addMenuItem(item);
      toast.success("Thêm món mới thành công! 🥳");
    }
    setEditingItem(null);
  };

  const handleUpdateSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSellerPassword(newPassword);
    updateQrCodeUrl(newQrUrl);
    toast.success("Đã cập nhật cài đặt! ⚙️");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setNewQrUrl(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const activeOrders = orders.filter(o => o.status !== "done");
  const doneOrders = orders.filter(o => o.status === "done");

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-md border-b border-border px-4 py-3">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-extrabold text-foreground">👨‍🍳 Quản lý</h1>
            <p className="text-xs text-muted-foreground">Admin panel của bạn</p>
          </div>
          <Link to="/" className="bg-primary text-primary-foreground rounded-full px-4 py-2 text-sm font-bold hover:opacity-90 transition-opacity">
            🛍️ Cửa hàng
          </Link>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-lg mx-auto px-4 mt-4">
        <div className="flex bg-muted rounded-xl p-1">
          <button
            onClick={() => setActiveTab("orders")}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "orders" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
          >
            📋 Đơn
          </button>
          <button
            onClick={() => setActiveTab("menu")}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "menu" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
          >
            🍕 Món
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "settings" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
          >
            ⚙️ Cài đặt
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-4 space-y-4">
        {activeTab === "orders" && (
          <>
            {activeOrders.length === 0 && doneOrders.length === 0 && (
              <div className="text-center py-16">
                <p className="text-4xl mb-2">📋</p>
                <p className="text-muted-foreground font-semibold">Chưa có đơn hàng nào</p>
              </div>
            )}

            {activeOrders.length > 0 && (
              <div className="space-y-3">
                <h2 className="font-extrabold text-foreground mb-3">📌 Đang xử lý ({activeOrders.length})</h2>
                {activeOrders.map(order => (
                  <OrderCard key={order.id} order={order} onNext={() => handleNext(order)} />
                ))}
              </div>
            )}

            {doneOrders.length > 0 && (
              <div className="space-y-3 opacity-60">
                <h2 className="font-extrabold text-foreground mb-3 mt-6">✅ Đã hoàn thành ({doneOrders.length})</h2>
                {doneOrders.map(order => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "menu" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-extrabold text-foreground">Quản lý món ăn</h2>
              <button
                onClick={() => setEditingItem({ id: "", name: "", price: 0, emoji: "🍕", category: "Đồ uống", description: "" })}
                className="bg-accent text-accent-foreground rounded-full px-4 py-1.5 text-xs font-bold hover:opacity-90"
              >
                + Thêm món
              </button>
            </div>

            {editingItem && (
              <div className="bg-card rounded-2xl p-4 border-2 border-primary/20 bounce-in">
                <h3 className="font-bold mb-4">{editingItem.id ? "Sửa món" : "Thêm món mới"}</h3>
                <form onSubmit={handleSaveMenu} className="space-y-3">
                  <div className="grid grid-cols-4 gap-3">
                    <div className="col-span-1">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Emoji</label>
                      <input name="emoji" defaultValue={editingItem.emoji} className="w-full bg-muted rounded-lg p-2 text-center" required />
                    </div>
                    <div className="col-span-3">
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Tên món</label>
                      <input name="name" defaultValue={editingItem.name} className="w-full bg-muted rounded-lg p-2" required />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Giá (đ)</label>
                      <input name="price" type="number" defaultValue={editingItem.price} className="w-full bg-muted rounded-lg p-2" required />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-muted-foreground">Danh mục</label>
                      <input name="category" defaultValue={editingItem.category} className="w-full bg-muted rounded-lg p-2" required />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Mô tả</label>
                    <textarea name="description" defaultValue={editingItem.description} className="w-full bg-muted rounded-lg p-2 text-sm" rows={2} />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="flex-1 bg-primary text-primary-foreground py-2 rounded-xl font-bold text-sm">Lưu lại</button>
                    <button type="button" onClick={() => setEditingItem(null)} className="flex-1 bg-muted text-muted-foreground py-2 rounded-xl font-bold text-sm">Hủy</button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 gap-3">
              {menuItems.map(item => (
                <div key={item.id} className="bg-card rounded-xl p-3 flex items-center justify-between border border-border">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.emoji}</span>
                    <div>
                      <p className="font-bold text-sm">{item.name}</p>
                      <p className="text-xs text-primary font-bold">{item.price.toLocaleString("vi-VN")}đ • {item.category}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingItem(item)} className="p-2 bg-muted rounded-lg text-xs font-bold">Sửa</button>
                    <button onClick={() => { if(confirm("Xóa món này?")) deleteMenuItem(item.id) }} className="p-2 bg-destructive/10 text-destructive rounded-lg text-xs font-bold">Xóa</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="space-y-6">
            <h2 className="font-extrabold text-foreground">Cài đặt hệ thống</h2>
            <form onSubmit={handleUpdateSettings} className="space-y-4 bg-card rounded-2xl p-6 kawaii-shadow border border-border">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Mật khẩu quản lý</label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full bg-muted rounded-xl p-3 text-sm"
                  placeholder="Nhập mật khẩu mới..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Mã QR Code thanh toán</label>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newQrUrl}
                      onChange={e => setNewQrUrl(e.target.value)}
                      className="flex-1 bg-muted rounded-xl p-3 text-sm"
                      placeholder="Dán link ảnh hoặc chọn file bên dưới..."
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="qr-upload"
                    />
                    <label
                      htmlFor="qr-upload"
                      className="flex items-center justify-center gap-2 w-full py-3 bg-accent text-accent-foreground rounded-xl font-bold text-sm cursor-pointer hover:opacity-90 transition-opacity border-2 border-dashed border-primary/20"
                    >
                      📸 Tải ảnh từ thiết bị
                    </label>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground italic">* Bạn có thể dán link ảnh trực tiếp hoặc tải ảnh từ điện thoại/máy tính.</p>
              </div>
              
              {newQrUrl && (
                <div className="mt-4 p-4 bg-muted/30 rounded-xl flex flex-col items-center">
                  <p className="text-[10px] font-bold mb-2 uppercase text-muted-foreground">Xem trước QR</p>
                  <img src={newQrUrl} alt="QR Preview" className="w-32 h-32 object-contain rounded-lg border border-border bg-white" />
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground rounded-full py-3 font-bold text-sm mt-4 shadow-md hover:opacity-90 transition-opacity"
              >
                Lưu cài đặt
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

const OrderCard = ({ order, onNext }: { order: Order; onNext?: () => void }) => {
  const status = statusConfig[order.status];
  const next = nextStatus[order.status];

  return (
    <div className="bg-card rounded-2xl p-4 kawaii-shadow bounce-in border border-border">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`${status.bg} px-3 py-1 rounded-full text-[10px] font-extrabold uppercase`}>
            {status.emoji} {status.label}
          </span>
          <span className="text-[10px] font-bold text-muted-foreground">#{order.id.slice(-4)}</span>
        </div>
        <span className="text-[10px] text-muted-foreground font-bold">{order.createdAt}</span>
      </div>

      <div className="flex justify-between items-start mb-2">
        <p className="font-bold text-foreground">👤 {order.customerName}</p>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${order.paymentMethod === 'transfer' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
          {order.paymentMethod === 'transfer' ? '💳 CK' : '💵 TM'}
        </span>
      </div>

      <div className="space-y-1 mb-3 bg-muted/30 p-2 rounded-lg">
        {order.items.map(item => (
          <div key={item.id} className="flex justify-between text-xs">
            <span className="text-foreground">
              {item.emoji} {item.name} × {item.quantity}
            </span>
            <span className="text-muted-foreground font-semibold">
              {(item.price * item.quantity).toLocaleString("vi-VN")}đ
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <span className="font-extrabold text-primary">{order.total.toLocaleString("vi-VN")}đ</span>
        {next && onNext && (
          <button
            onClick={onNext}
            className="bg-primary text-primary-foreground rounded-full px-4 py-2 text-xs font-bold hover:opacity-90 transition-opacity active:scale-95 shadow-md"
          >
            {next === "preparing" ? "👨‍🍳 Bắt đầu làm" : "✅ Hoàn thành"}
          </button>
        )}
      </div>
    </div>
  );
};

export default SellerPage;
