import { useState, useEffect } from "react";
import "./admin.css";

const BASE = "http://localhost:8080";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterPayment, setFilterPayment] = useState("");
  const [selected, setSelected] = useState(null);

  const fetchOrders = () => {
    fetch(`${BASE}/order`)
      .then((r) => r.json())
      .then((data) => { setOrders(data); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${BASE}/order/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        alert("Status updated successfully!");
        fetchOrders();
      } else {
        alert("Failed to update status");
      }
    } catch (e) {
      alert("Error updating order");
    }
  };

  const filtered = orders.filter((o) => {
    const name = o.address?.name?.toLowerCase() || "";
    const city = o.address?.city?.toLowerCase() || "";
    const matchSearch = name.includes(search.toLowerCase()) || city.includes(search.toLowerCase());
    const matchPay = filterPayment ? o.paymentMethod === filterPayment : true;
    return matchSearch && matchPay;
  });

  const totalRevenue = filtered.reduce((sum, o) => sum + (o.totalPayable || 0), 0);

  const payBadge = (method) => {
    if (method === "COD") return "badge badge-cod";
    if (method === "UPI") return "badge badge-upi";
    if (method === "CARD") return "badge badge-card";
    return "badge";
  };

  return (
    <div className="admin-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">📦 Orders Management</h2>
          <p className="page-sub">Track and manage all customer orders</p>
        </div>
        <div className="header-meta">
          <div className="mini-stat">
            <span>Total Revenue</span>
            <strong>₹{totalRevenue.toLocaleString("en-IN")}</strong>
          </div>
          <div className="mini-stat">
            <span>Orders Shown</span>
            <strong>{filtered.length}</strong>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <input className="search-input" placeholder="🔍 Search by customer or city..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="filter-select" value={filterPayment} onChange={(e) => setFilterPayment(e.target.value)}>
          <option value="">All Payments</option>
          <option value="COD">Cash on Delivery</option>
          <option value="UPI">UPI</option>
          <option value="CARD">Card</option>
        </select>
      </div>

      {loading ? (
        <div className="admin-loading"><div className="spinner"></div></div>
      ) : (
        <div className="card-section">
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Address</th>
                  <th>Items</th>
                  <th>MRP</th>
                  <th>Discount</th>
                  <th>Payable</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={10} className="empty-row">No orders found</td></tr>
                ) : (
                  filtered.map((order) => (
                    <tr key={order._id} className="table-row">
                      <td className="order-id">#{order._id.slice(-6).toUpperCase()}</td>
                      <td>
                        <div className="customer-cell">
                          <div className="avatar">{order.address?.name?.[0]?.toUpperCase() || "?"}</div>
                          <div>
                            <p className="cname">{order.address?.name || "N/A"}</p>
                            <p className="cphone">{order.address?.phone || "—"}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <p className="cname">{order.address?.city}</p>
                        <p className="cphone">{order.address?.pincode}</p>
                      </td>
                      <td><span className="items-badge">{order.cart?.length || 0} items</span></td>
                      <td>₹{(order.totalMRP || 0).toLocaleString("en-IN")}</td>
                      <td className="discount-cell">-₹{(order.totalDiscount || 0).toLocaleString("en-IN")}</td>
                      <td className="amount-cell">₹{(order.totalPayable || 0).toLocaleString("en-IN")}</td>
                      <td><span className={payBadge(order.paymentMethod)}>{order.paymentMethod}</span></td>
                      <td>
                        <select 
                          value={order.status || "Pending"} 
                          onChange={(e) => updateStatus(order._id, e.target.value)}
                          style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #ccc", fontSize: "13px" }}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                      <td className="date-cell">{order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN") : "—"}</td>
                      <td>
                        <button className="view-btn" onClick={() => setSelected(order)}>View</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box modal-wide" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Order Details — #{selected._id.slice(-6).toUpperCase()}</h3>
              <button className="close-btn" onClick={() => setSelected(null)}>✕</button>
            </div>
            <div className="order-detail-grid">
              <div className="order-detail-section">
                <h4>📍 Delivery Address</h4>
                <p><strong>{selected.address?.name}</strong></p>
                <p>{selected.address?.house}</p>
                <p>{selected.address?.city} — {selected.address?.pincode}</p>
                <p>📞 {selected.address?.phone}</p>
              </div>
              <div className="order-detail-section">
                <h4>💳 Payment Info</h4>
                <p>Method: <strong>{selected.paymentMethod}</strong></p>
                {selected.upiId && <p>UPI ID: {selected.upiId}</p>}
                <p>Status: <strong>{selected.status || "Pending"}</strong></p>
                <p>MRP: ₹{(selected.totalMRP || 0).toLocaleString("en-IN")}</p>
                <p>Discount: -₹{(selected.totalDiscount || 0).toLocaleString("en-IN")}</p>
                <p className="payable-highlight">Total Paid: ₹{(selected.totalPayable || 0).toLocaleString("en-IN")}</p>
              </div>
            </div>
            <div className="order-detail-section">
              <h4>🛒 Cart Items</h4>
              <div className="cart-items-list">
                {selected.cart?.map((item, i) => (
                  <div key={i} className="cart-item-row">
                    {item.image && <img src={item.image} alt={item.name} className="cart-item-img" />}
                    <div className="cart-item-info">
                      <p className="cart-item-name">{item.name}</p>
                      <p className="cart-item-qty">Qty: {item.quantity}</p>
                    </div>
                    <span className="cart-item-price">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
