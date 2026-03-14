import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import "./ceekeey.css";

const AddressPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const product = state?.product;

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [savedAddresses, setSavedAddresses] = useState(() => {
    const saved = localStorage.getItem(`addresses_${user?.email}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [selectedId, setSelectedId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newAddr, setNewAddr] = useState({ name: user?.fullname || "", phone: user?.phone || "", house: "", area: "", city: "", state: "", pincode: "", type: "Home" });

  useEffect(() => { localStorage.setItem(`addresses_${user?.email}`, JSON.stringify(savedAddresses)); }, [savedAddresses, user?.email]);

  const handleAdd = () => {
    const { name, phone, house, city, pincode } = newAddr;
    if (!name || !phone || !house || !city || !pincode) { alert("Please fill all required fields"); return; }
    const newId = Date.now();
    const updated = [...savedAddresses, { id: newId, ...newAddr }];
    setSavedAddresses(updated);
    setSelectedId(newId);
    setShowForm(false);
    setNewAddr({ name: user?.fullname || "", phone: user?.phone || "", house: "", area: "", city: "", state: "", pincode: "", type: "Home" });
  };

  const handleContinue = () => {
    const address = savedAddresses.find(a => a.id === selectedId);
    if (!address) { alert("Please select or add a delivery address"); return; }
    navigate("/payment", { state: { address, product } });
  };

  return (
    <div style={{ background: "#f1f3f6", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 16px", display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>

        {/* ── Left: Addresses ── */}
        <div style={{ flex: 1, minWidth: 300 }}>
          {/* Breadcrumb */}
          <div style={{ background: "#fff", borderRadius: 4, border: "1px solid #e0e0e0", marginBottom: 16, padding: "0 16px" }}>
            {[{ n: "1", label: "Cart", done: true }, { n: "2", label: "Address", done: false, active: true }, { n: "3", label: "Payment", done: false }].map((s, i) => (
              <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "16px 8px", color: s.active ? "#2874f0" : s.done ? "#388e3c" : "#878787", fontWeight: s.active ? 700 : 400, fontSize: 13 }}>
                <span style={{
                  width: 22, height: 22, borderRadius: "50%",
                  background: s.active ? "#2874f0" : s.done ? "#388e3c" : "#e0e0e0",
                  color: s.done || s.active ? "#fff" : "#757575",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: 12, flexShrink: 0,
                }}>
                  {s.done ? "✓" : s.n}
                </span>
                {s.label}
                {i < 2 && <span style={{ margin: "0 12px", color: "#e0e0e0" }}>›</span>}
              </span>
            ))}
          </div>

          {/* Saved Addresses */}
          <div style={{ background: "#fff", borderRadius: 4, border: "1px solid #e0e0e0", overflow: "hidden" }}>
            <div style={{ background: "#2874f0", color: "#fff", padding: "14px 20px", fontWeight: 700, fontSize: 15 }}>
              📍 Select Delivery Address
            </div>

            {savedAddresses.map((addr) => (
              <div key={addr.id} onClick={() => setSelectedId(addr.id)}
                style={{
                  padding: 20, borderBottom: "1px solid #f5f5f5", cursor: "pointer",
                  background: selectedId === addr.id ? "#e8f0fe" : "#fff",
                  borderLeft: selectedId === addr.id ? "4px solid #2874f0" : "4px solid transparent",
                  transition: "all 0.2s"
                }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", gap: 12 }}>
                    <span style={{
                      width: 18, height: 18, borderRadius: "50%", marginTop: 2, flexShrink: 0,
                      border: `2px solid ${selectedId === addr.id ? "#2874f0" : "#bbb"}`,
                      background: selectedId === addr.id ? "#2874f0" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      {selectedId === addr.id && <span style={{ background: "#fff", borderRadius: "50%", width: 6, height: 6, display: "block" }} />}
                    </span>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                        <span style={{ fontWeight: 700, fontSize: 14, color: "#212121" }}>{addr.name}</span>
                        <span style={{
                          fontSize: 11, fontWeight: 700, color: "#2874f0",
                          border: "1px solid #2874f0", borderRadius: 3, padding: "1px 6px"
                        }}>{addr.type}</span>
                      </div>
                      <p style={{ fontSize: 13, color: "#444", lineHeight: 1.6, margin: 0 }}>
                        {addr.house}{addr.area ? `, ${addr.area}` : ""}, {addr.city}{addr.state ? `, ${addr.state}` : ""} - <strong>{addr.pincode}</strong>
                      </p>
                      <p style={{ fontSize: 13, color: "#757575", marginTop: 4 }}>📞 {addr.phone}</p>
                    </div>
                  </div>
                  <button onClick={(e) => {
                    e.stopPropagation();
                    setSavedAddresses(savedAddresses.filter(a => a.id !== addr.id));
                    if (selectedId === addr.id) setSelectedId(null);
                  }} style={{ background: "none", border: "none", color: "#f44336", cursor: "pointer", fontSize: 16 }}>✕</button>
                </div>
                {selectedId === addr.id && (
                  <div style={{ marginTop: 12, marginLeft: 30 }}>
                    <button onClick={handleContinue}
                      style={{
                        background: "#fb641b", color: "#fff", border: "none", padding: "12px 32px",
                        borderRadius: 4, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit"
                      }}>
                      Deliver Here →
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* Add New Address toggle */}
            <div
              onClick={() => setShowForm(!showForm)}
              style={{
                padding: 20, display: "flex", alignItems: "center", gap: 12,
                cursor: "pointer", color: "#2874f0", fontWeight: 700, fontSize: 14,
                borderTop: savedAddresses.length ? "1px solid #f0f0f0" : "none"
              }}>
              <span style={{
                width: 28, height: 28, borderRadius: "50%", border: "2px solid #2874f0",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 300
              }}>+</span>
              Add a new address
            </div>

            {/* New Address Form */}
            {showForm && (
              <div style={{ padding: 20, borderTop: "1px solid #f0f0f0", background: "#f9f9f9" }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#212121", marginBottom: 16 }}>Add New Delivery Address</h3>

                {/* Address type */}
                <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                  {["Home", "Work", "Other"].map((t) => (
                    <button key={t} onClick={() => setNewAddr({ ...newAddr, type: t })}
                      style={{
                        padding: "6px 20px", borderRadius: 4, cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600,
                        border: newAddr.type === t ? "2px solid #2874f0" : "1px solid #ddd",
                        background: newAddr.type === t ? "#e8f0fe" : "#fff",
                        color: newAddr.type === t ? "#2874f0" : "#212121",
                      }}>{t}</button>
                  ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[
                    { f: "name", p: "Full Name *", type: "text" },
                    { f: "phone", p: "Mobile Number *", type: "tel" },
                    { f: "pincode", p: "Pincode *", type: "text" },
                    { f: "city", p: "City / Town *", type: "text" },
                  ].map(({ f, p, type }) => (
                    <input key={f} type={type} placeholder={p} value={newAddr[f]}
                      onChange={(e) => setNewAddr({ ...newAddr, [f]: e.target.value })}
                      style={{ padding: "11px 14px", border: "1px solid #ddd", borderRadius: 4, fontSize: 13, fontFamily: "inherit", outline: "none" }} />
                  ))}
                  <input type="text" placeholder="Flat, House No., Building *" value={newAddr.house}
                    onChange={(e) => setNewAddr({ ...newAddr, house: e.target.value })}
                    style={{ padding: "11px 14px", border: "1px solid #ddd", borderRadius: 4, fontSize: 13, fontFamily: "inherit", outline: "none", gridColumn: "1/-1" }} />
                  <input type="text" placeholder="Area, Street, Sector, Village" value={newAddr.area}
                    onChange={(e) => setNewAddr({ ...newAddr, area: e.target.value })}
                    style={{ padding: "11px 14px", border: "1px solid #ddd", borderRadius: 4, fontSize: 13, fontFamily: "inherit", outline: "none" }} />
                  <input type="text" placeholder="State" value={newAddr.state}
                    onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                    style={{ padding: "11px 14px", border: "1px solid #ddd", borderRadius: 4, fontSize: 13, fontFamily: "inherit", outline: "none" }} />
                </div>
                <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
                  <button onClick={handleAdd}
                    style={{ background: "#2874f0", color: "#fff", border: "none", padding: "12px 28px", borderRadius: 4, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                    Save Address
                  </button>
                  <button onClick={() => setShowForm(false)}
                    style={{ background: "#fff", color: "#333", border: "1px solid #ddd", padding: "12px 24px", borderRadius: 4, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Right: Order Summary ── */}
        {product && (
          <div style={{ width: 300, flexShrink: 0 }}>
            <div style={{ background: "#fff", borderRadius: 4, border: "1px solid #e0e0e0", overflow: "hidden" }}>
              <div style={{ background: "#f5f5f5", padding: "14px 20px", borderBottom: "1px solid #e0e0e0", fontSize: 13, fontWeight: 700, color: "#757575", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Price Details
              </div>
              <div style={{ padding: 20 }}>
                {/* Product mini card */}
                <div style={{ display: "flex", gap: 12, marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #f0f0f0" }}>
                  {product.image && <img src={product.image} alt={product.name} style={{ width: 60, height: 60, objectFit: "contain", border: "1px solid #f0f0f0", borderRadius: 4 }} />}
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#212121", lineHeight: 1.4, marginBottom: 4 }}>{product.name}</p>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#212121" }}>₹{Number(product.price).toLocaleString("en-IN")}</p>
                  </div>
                </div>
                {[
                  { label: "Price (1 item)", val: `₹${Number(product.price).toLocaleString("en-IN")}` },
                  { label: "Delivery Charges", val: <span style={{ color: "#388e3c" }}>FREE</span> },
                ].map(({ label, val }) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 12 }}>
                    <span style={{ color: "#444" }}>{label}</span>
                    <span>{val}</span>
                  </div>
                ))}
                <div style={{ borderTop: "1px dashed #ddd", paddingTop: 14, marginTop: 4, display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 700 }}>
                  <span>Total Amount</span>
                  <span>₹{Number(product.price).toLocaleString("en-IN")}</span>
                </div>
                <p style={{ color: "#388e3c", fontSize: 13, marginTop: 12 }}>✅ Your order is eligible for FREE Delivery</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressPage;
