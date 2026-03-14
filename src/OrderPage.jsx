import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./ceekeey.css";

const BASE = "http://localhost:8080";

/* =======================
   Order Tracking Helpers
======================= */
const ORDER_STEPS = ["Pending", "Processing", "Shipped", "Delivered"];

const getStepIndex = (status) => {
  const index = ORDER_STEPS.indexOf(status || "Pending");
  return index === -1 ? 0 : index;
};

const OrderTracker = ({ status }) => {
  const currentStep = getStepIndex(status);

  return (
    <div style={{ display: "flex", alignItems: "center", width: "100%", maxWidth: 400, marginTop: 12 }}>
      {ORDER_STEPS.map((step, index) => (
        <div key={step} style={{ display: "flex", alignItems: "center", flex: index < ORDER_STEPS.length - 1 ? 1 : 0 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
            <div style={{
              width: 14, height: 14, borderRadius: "50%",
              background: index <= currentStep ? "#26a541" : "#e0e0e0",
              zIndex: 2,
              border: index <= currentStep ? "3px solid #c9e6d1" : "3px solid transparent",
            }} />
            <span style={{
              position: "absolute", top: 22, fontSize: 11, fontWeight: index <= currentStep ? 600 : 400,
              color: index <= currentStep ? "#212121" : "#878787", whiteSpace: "nowrap"
            }}>{step}</span>
          </div>
          {index < ORDER_STEPS.length - 1 && (
            <div style={{ height: 3, flex: 1, background: index < currentStep ? "#26a541" : "#e0e0e0", margin: "0 -2px", zIndex: 1 }} />
          )}
        </div>
      ))}
    </div>
  );
};

/* =======================
        Main Page
======================= */
const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!user) {
      navigate("/auth", { state: { from: "/orders" } });
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(`${BASE}/order`);
        const data = await res.json();
        // Filter orders for the logged-in customer using phone number or exact name
        const customerOrders = data.filter(o => 
          o.address?.phone === user.phone || o.address?.name === user.fullname
        );
        setOrders(customerOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div style={{ background: "#f1f3f6", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ maxWidth: 1000, margin: "24px auto", padding: "0 16px" }}>
        
        {/* Breadcrumb */}
        <div style={{ fontSize: 13, color: "#878787", marginBottom: 12 }}>
          <span style={{ cursor: "pointer", color: "#2874f0" }} onClick={() => navigate("/")}>Home</span> › 
          <span style={{ cursor: "pointer", color: "#2874f0", marginLeft: 6 }} onClick={() => navigate("/profile")}>My Account</span> › 
          <span style={{ marginLeft: 6 }}>My Orders</span>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 60, color: "#878787" }}>Loading your orders...</div>
        ) : orders.length === 0 ? (
          <div style={{ background: "#fff", padding: "60px 20px", textAlign: "center", borderRadius: 4, boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}>
            <div style={{ fontSize: 80, marginBottom: 16 }}>📦</div>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: "#212121", marginBottom: 8 }}>No orders found!</h2>
            <p style={{ color: "#878787", marginBottom: 24 }}>Looks like you haven't placed any orders yet.</p>
            <button onClick={() => navigate("/")} style={{ background: "#2874f0", color: "#fff", padding: "12px 32px", fontSize: 14, fontWeight: 700, border: "none", borderRadius: 4, cursor: "pointer", fontFamily: "inherit" }}>
              Start Shopping
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: "#212121" }}>My Orders</h2>
            
            {orders.map((order) => (
              <div key={order._id} style={{ background: "#fff", borderRadius: 4, border: "1px solid #e0e0e0", overflow: "hidden", transition: "box-shadow 0.2s" }} className="ck-order-card">
                
                {/* Order Header */}
                <div style={{ background: "#f9f9f9", padding: "14px 24px", borderBottom: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontSize: 12, color: "#878787", textTransform: "uppercase", fontWeight: 600 }}>Order ID</span>
                    <span style={{ fontSize: 13, color: "#212121", fontWeight: 700, marginLeft: 8 }}>{order._id.slice(-8).toUpperCase()}</span>
                    <span style={{ margin: "0 12px", color: "#ddd" }}>|</span>
                    <span style={{ fontSize: 12, color: "#878787", textTransform: "uppercase", fontWeight: 600 }}>Placed On</span>
                    <span style={{ fontSize: 13, color: "#212121", fontWeight: 600, marginLeft: 8 }}>{new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "#212121" }}>
                    Total: ₹{order.totalPayable.toLocaleString('en-IN')}
                  </div>
                </div>

                {/* Order Items */}
                <div style={{ padding: "0 24px" }}>
                  {order.cart?.map((item, idx) => {
                    const imgUrl = item.image && item.image.startsWith("http") ? item.image : (item.image ? `${BASE}${item.image}` : null);
                    return (
                      <div key={idx} style={{ padding: "24px 0", borderBottom: idx < order.cart.length - 1 ? "1px solid #f0f0f0" : "none", display: "flex", gap: 24, alignItems: "flex-start" }}>
                        
                        {/* Image */}
                        <div style={{ width: 80, height: 80, flexShrink: 0, borderRadius: 4, border: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "center", background: "#f9f9f9", cursor: "pointer" }} onClick={() => navigate(`/product/details/${item.id}`)}>
                          {imgUrl ? (
                            <img src={imgUrl} alt={item.name} style={{ width: "80%", height: "80%", objectFit: "contain" }} />
                          ) : (
                            <span style={{ fontSize: 24 }}>📦</span>
                          )}
                        </div>

                        {/* Details */}
                        <div style={{ flex: 1 }}>
                          <h3 style={{ fontSize: 14, fontWeight: 500, color: "#212121", marginBottom: 6, cursor: "pointer", display: "inline-block" }} onClick={() => navigate(`/product/details/${item.id}`)} onMouseOver={e => e.target.style.color="#2874f0"} onMouseOut={e => e.target.style.color="#212121"}>
                            {item.name}
                          </h3>
                          <div style={{ fontSize: 12, color: "#878787", marginBottom: 8 }}>Qty: <strong>{item.quantity}</strong></div>
                          <div style={{ fontSize: 15, fontWeight: 600, color: "#212121" }}>₹{Number(item.price).toLocaleString("en-IN")}</div>
                        </div>

                        {/* Status tracking */}
                        <div style={{ width: 340, paddingRight: 20 }}>
                          <p style={{ fontSize: 14, fontWeight: 600, color: "#212121", marginBottom: 4 }}>
                            Delivery Expected by {new Date(new Date(order.createdAt).getTime() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                          </p>
                          <p style={{ fontSize: 12, color: "#878787" }}>Your item has been placed.</p>
                          <OrderTracker status={order.status || "Pending"} />
                        </div>

                      </div>
                    );
                  })}
                </div>

                {/* Order Footer - Address & Payment */}
                <div style={{ background: "#f9f9f9", padding: "16px 24px", borderTop: "1px solid #f0f0f0", display: "flex", gap: 40, fontSize: 13 }}>
                  <div>
                    <span style={{ fontWeight: 600, color: "#878787", display: "block", marginBottom: 4 }}>Delivery Address</span>
                    <span style={{ color: "#212121", fontWeight: 600 }}>{order.address?.name}</span>
                    <span style={{ color: "#444" }}>, {order.address?.house}, {order.address?.city} - {order.address?.pincode}</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: 600, color: "#878787", display: "block", marginBottom: 4 }}>Payment Method</span>
                    <span style={{ color: "#212121" }}>{order.paymentMethod === "COD" ? "Cash on Delivery" : order.paymentMethod}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
