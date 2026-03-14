import { useLocation, useNavigate } from "react-router-dom";
import productStore from "./CartStore";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";

const BASE = "http://localhost:8080";

const PaymentPage = () => {
  const { cart: storeCart, removeAllCart } = productStore();
  const navigate = useNavigate();
  const { state } = useLocation();

  const buyNowProduct = state?.product; // from Buy Now
  const address = state?.address || state; // from AddressPage

  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (buyNowProduct) setCart([buyNowProduct]);
    else setCart(storeCart);
  }, [buyNowProduct, storeCart]);

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [upiId, setUpiId] = useState("");
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "", emi: false });
  const [loading, setLoading] = useState(false);

  const totalMRP = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalDiscount = cart.reduce((sum, item) => sum + Math.round(item.price * 0.1) * item.quantity, 0);
  const totalPayable = totalMRP - totalDiscount;

  const placeOrder = async () => {
    if (!address) return alert("Select address");
    if (paymentMethod === "UPI" && !upiId) return alert("Enter UPI ID");
    if (paymentMethod === "CARD" && (!card.number || !card.cvv)) return alert("Fill card details");

    const order = { address, cart, paymentMethod, upiId, card, totalMRP, totalDiscount, totalPayable };
    setLoading(true);

    try {
      const response = await fetch(`${BASE}/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });
      if (!response.ok) throw new Error("Failed to place order");
      await response.json();
      removeAllCart();
      navigate("/success");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "#f1f3f6", minHeight: "100vh" }}>
      <Navbar />
      <div style={styles.page}>
      <div style={styles.left}>
        {address && (
          <div style={styles.card}>
            <h3>Delivery Address</h3>
            <p><b>{address.name}</b></p>
            <p>{address.house}, {address.city} - {address.pincode}</p>
            <p>📞 {address.phone}</p>
          </div>
        )}

        <div style={styles.card}>
          <h3>Payment Options</h3>
          <div style={styles.optionBox} onClick={() => setPaymentMethod("COD")}>
            <input type="radio" checked={paymentMethod === "COD"} readOnly />
            <span>Cash on Delivery</span>
          </div>

          <div style={styles.optionBox} onClick={() => setPaymentMethod("UPI")}>
            <input type="radio" checked={paymentMethod === "UPI"} readOnly />
            <span>UPI</span>
          </div>
          {paymentMethod === "UPI" && <input style={styles.input} placeholder="UPI ID" value={upiId} onChange={(e) => setUpiId(e.target.value)} />}

          <div style={styles.optionBox} onClick={() => setPaymentMethod("CARD")}>
            <input type="radio" checked={paymentMethod === "CARD"} readOnly />
            <span>Card</span>
          </div>
          {paymentMethod === "CARD" && (
            <div style={styles.cardForm}>
              <input style={styles.input} placeholder="Card Number" maxLength="16" onChange={(e) => setCard({ ...card, number: e.target.value })} />
              <input style={styles.input} placeholder="Name on Card" onChange={(e) => setCard({ ...card, name: e.target.value })} />
              <div style={{ display: "flex", gap: 10 }}>
                <input style={styles.input} placeholder="MM/YY" onChange={(e) => setCard({ ...card, expiry: e.target.value })} />
                <input style={styles.input} placeholder="CVV" maxLength="3" onChange={(e) => setCard({ ...card, cvv: e.target.value })} />
              </div>
              <label><input type="checkbox" onChange={() => setCard({ ...card, emi: !card.emi })} /> No Cost EMI</label>
            </div>
          )}
        </div>
      </div>

      <div style={styles.right}>
        <h3>PRICE DETAILS</h3>
        {cart.map((item, i) => (
          <div key={i} style={styles.itemRow}>
            <span>{item.name} x {item.quantity}</span>
            <span>₹{item.price * item.quantity} <span style={{ color: "green" }}>(-₹{Math.round(item.price * 0.1) * item.quantity})</span></span>
          </div>
        ))}
        <hr />
        <div style={styles.row}><span>Total MRP</span><span>₹{totalMRP}</span></div>
        <div style={styles.row}><span>Discount</span><span style={{ color: "green" }}>-₹{totalDiscount}</span></div>
        <div style={{ ...styles.row, fontWeight: "bold" }}><span>Total Amount</span><span>₹{totalPayable}</span></div>

        <button style={{ ...styles.placeOrderBtn, opacity: loading ? 0.6 : 1 }} onClick={placeOrder} disabled={loading}>
          {loading ? "Placing Order..." : "PLACE ORDER"}
        </button>
      </div>
    </div>
    </div>
  );
};

const styles = {
  page: { display: "flex", gap: 20, padding: 20 },
  left: { flex: 2 },
  right: { flex: 1, background: "#fff", padding: 20, position: "sticky", top: 20 },
  card: { background: "#fff", padding: 20, marginBottom: 15 },
  optionBox: { display: "flex", alignItems: "center", gap: 10, padding: "10px 0", cursor: "pointer" },
  input: { width: "100%", padding: 10, margin: "8px 0" },
  cardForm: { marginTop: 10 },
  row: { display: "flex", justifyContent: "space-between", margin: "10px 0" },
  itemRow: { display: "flex", justifyContent: "space-between", margin: "6px 0" },
  placeOrderBtn: { width: "100%", padding: 14, background: "#fb641b", color: "#fff", border: "none", fontSize: 16, marginTop: 20 },
};

export default PaymentPage;
