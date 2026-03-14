import { useNavigate } from "react-router-dom";
import productStore from "./CartStore";
import Navbar from "./Navbar";
import "./ceekeey.css";

const CartPage = () => {
  const { cart, removeCart, setCart, decreaseQty } = productStore();
  const navigate = useNavigate();

  const totalMRP = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalDiscount = cart.reduce((sum, item) => sum + Math.round(item.price * 0.15) * item.quantity, 0);
  const deliveryCharge = totalMRP > 499 ? 0 : 40;
  const totalPayable = totalMRP - totalDiscount + deliveryCharge;
  const savings = totalDiscount;

  const handlePlaceOrder = () => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/auth", {
        state: {
          from: "/cart",
          tab: "login",
        },
      });
      return;
    }
    navigate("/address");
  };

  if (cart.length === 0) {
    return (
      <div style={{ background: "#f1f3f6", minHeight: "100vh" }}>
        <Navbar />
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <div style={{ fontSize: 80, marginBottom: 16 }}>🛒</div>
          <h2 style={{ fontSize: 26, fontWeight: 700, color: "#212121", marginBottom: 8 }}>Your cart is empty!</h2>
          <p style={{ color: "#878787", marginBottom: 32, fontSize: 15 }}>Add items to it now to proceed to checkout</p>
          <button
            onClick={() => navigate("/")}
            style={{
              background: "#2874f0", color: "#fff", border: "none",
              padding: "14px 40px", borderRadius: 4,
              fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
            }}>
            Shop Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#f1f3f6", minHeight: "100vh" }}>
      <Navbar />
      <div style={{
        maxWidth: 1100, margin: "0 auto", padding: "20px 16px",
        display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap",
      }}>

        {/* ── LEFT: Cart Items ── */}
        <div style={{ flex: 1, minWidth: 320 }}>
          {/* Header */}
          <div style={{
            background: "#fff", borderRadius: 4, border: "1px solid #e0e0e0",
            padding: "16px 24px", marginBottom: 12,
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#212121" }}>
              My Cart <span style={{ color: "#878787", fontWeight: 400, fontSize: 14 }}>({cart.length} item{cart.length > 1 ? "s" : ""})</span>
            </h2>
            <p style={{ fontSize: 13, color: "#388e3c", fontWeight: 600 }}>✅ Eligible for FREE Delivery</p>
          </div>

          {/* Cart Items */}
          {cart.map((item) => {
            const disc = Math.round(item.price * 0.15);
            const finalPrice = item.price - disc;
            return (
              <div key={item.id} style={{
                background: "#fff", borderRadius: 4, border: "1px solid #e0e0e0",
                padding: "20px 24px", marginBottom: 8,
                display: "flex", gap: 20, alignItems: "flex-start",
              }}>
                {/* Image */}
                <div style={{
                  width: 110, height: 110, flexShrink: 0, cursor: "pointer",
                  border: "1px solid #f0f0f0", borderRadius: 4, overflow: "hidden",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "#fafafa",
                }} onClick={() => navigate(`/product/details/${item.id}`)}>
                  {item.image
                    ? <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "contain", padding: 4 }} />
                    : <span style={{ fontSize: 40 }}>📦</span>
                  }
                </div>

                {/* Info */}
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: "#212121", marginBottom: 6, lineHeight: 1.4 }}>{item.name}</h3>

                  {/* Price row */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 18, fontWeight: 700, color: "#212121" }}>₹{(finalPrice * item.quantity).toLocaleString("en-IN")}</span>
                    <span style={{ fontSize: 13, color: "#878787", textDecoration: "line-through" }}>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                    <span style={{ fontSize: 13, color: "#388e3c", fontWeight: 600 }}>15% off</span>
                  </div>

                  {/* Qty Controls */}
                  <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 12 }}>
                    <button onClick={() => decreaseQty(item.id)} style={qtyBtn}>–</button>
                    <span style={{ width: 40, textAlign: "center", fontSize: 15, fontWeight: 700, border: "1px solid #e0e0e0", borderLeft: "none", borderRight: "none", padding: "6px 0", lineHeight: 1.5 }}>
                      {item.quantity}
                    </span>
                    <button onClick={() => setCart({ ...item, quantity: 1 })} style={{ ...qtyBtn, borderLeft: "none" }}>+</button>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 24 }}>
                    <button onClick={() => removeCart(item.id)}
                      style={{ background: "none", border: "none", color: "#878787", cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: 600, padding: 0 }}>
                      REMOVE
                    </button>
                    <button style={{ background: "none", border: "none", color: "#878787", cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: 600, padding: 0 }}>
                      SAVE FOR LATER
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Place Order bottom button (mobile-friendly) */}
          <div style={{
            background: "#fff", borderRadius: 4, border: "1px solid #e0e0e0",
            padding: "16px 24px", display: "flex", justifyContent: "flex-end",
          }}>
            <button onClick={handlePlaceOrder} style={placeOrderBtn}>
              Place Order →
            </button>
          </div>
        </div>

        {/* ── RIGHT: Price Summary ── */}
        <div style={{ width: 320, flexShrink: 0 }}>
          <div style={{ background: "#fff", borderRadius: 4, border: "1px solid #e0e0e0", overflow: "hidden" }}>
            <div style={{
              padding: "14px 20px", borderBottom: "1px solid #e0e0e0",
              fontSize: 13, fontWeight: 700, color: "#878787",
              textTransform: "uppercase", letterSpacing: "0.06em",
              background: "#f5f5f5",
            }}>
              Price Details
            </div>
            <div style={{ padding: 20 }}>
              {[
                { label: `Price (${cart.length} item${cart.length > 1 ? "s" : ""})`, val: `₹${totalMRP.toLocaleString("en-IN")}` },
                { label: "Discount", val: <span style={{ color: "#388e3c" }}>− ₹{totalDiscount.toLocaleString("en-IN")}</span> },
                { label: "Delivery Charges", val: deliveryCharge === 0 ? <span style={{ color: "#388e3c" }}>FREE</span> : `₹${deliveryCharge}` },
              ].map(({ label, val }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, fontSize: 14, color: "#444" }}>
                  <span>{label}</span>
                  <span>{val}</span>
                </div>
              ))}

              <div style={{ borderTop: "1px dashed #e0e0e0", paddingTop: 14, marginBottom: 14, display: "flex", justifyContent: "space-between", fontSize: 17, fontWeight: 700 }}>
                <span>Total Amount</span>
                <span>₹{totalPayable.toLocaleString("en-IN")}</span>
              </div>

              {savings > 0 && (
                <p style={{ color: "#388e3c", fontSize: 14, fontWeight: 600, marginBottom: 16 }}>
                  🎉 You will save ₹{savings.toLocaleString("en-IN")} on this order!
                </p>
              )}

              <button onClick={handlePlaceOrder} style={{ ...placeOrderBtn, width: "100%" }}>
                Place Order →
              </button>

              {/* Safe checkout */}
              <div style={{ textAlign: "center", marginTop: 16 }}>
                <p style={{ fontSize: 12, color: "#878787" }}>🔒 Safe and Secure Payments.</p>
                <p style={{ fontSize: 11, color: "#bbb", marginTop: 4 }}>Easy Returns. 100% Authentic products.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const qtyBtn = {
  width: 34, height: 34, border: "1px solid #e0e0e0",
  background: "#fff", cursor: "pointer", fontSize: 18,
  fontWeight: 300, color: "#212121", display: "flex",
  alignItems: "center", justifyContent: "center", borderRadius: 0,
  fontFamily: "inherit",
};

const placeOrderBtn = {
  background: "#fb641b", color: "#fff", border: "none",
  padding: "14px 32px", borderRadius: 4, fontSize: 15,
  fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
  letterSpacing: "0.03em", transition: "background 0.2s",
};

export default CartPage;
