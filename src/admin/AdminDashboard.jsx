import { useState, useEffect } from "react";
import "./admin.css";

const BASE = "http://localhost:8080";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${BASE}/product`).then((r) => r.json()),
      fetch(`${BASE}/order`).then((r) => r.json()),
    ]).then(([products, orders]) => {
      const revenue = orders.reduce((sum, o) => sum + (o.totalPayable || 0), 0);
      const customerSet = new Set(orders.map((o) => o.address?.phone));
      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalCustomers: customerSet.size,
        totalRevenue: revenue,
      });
      setRecentOrders(orders.slice(0, 6));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const statusColor = (method) => {
    if (method === "COD") return "badge-cod";
    if (method === "UPI") return "badge-upi";
    if (method === "CARD") return "badge-card";
    return "badge-cod";
  };

  if (loading) return (
    <div className="admin-loading">
      <div className="spinner"></div>
      <p>Loading Dashboard...</p>
    </div>
  );

  return (
    <div className="admin-page">
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div>
          <h1 className="welcome-title">Welcome back, Admin! 👋</h1>
          <p className="welcome-sub">Here's what's happening with your store today.</p>
        </div>
        <div className="welcome-date">
          {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        <div className="stat-card stat-blue">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <p className="stat-label">Total Revenue</p>
            <h2 className="stat-value">₹{stats.totalRevenue.toLocaleString("en-IN")}</h2>
            <span className="stat-badge green">+12.5% this month</span>
          </div>
        </div>
        <div className="stat-card stat-purple">
          <div className="stat-icon">📦</div>
          <div className="stat-info">
            <p className="stat-label">Total Orders</p>
            <h2 className="stat-value">{stats.totalOrders}</h2>
            <span className="stat-badge green">+8.2% this month</span>
          </div>
        </div>
        <div className="stat-card stat-orange">
          <div className="stat-icon">🛒</div>
          <div className="stat-info">
            <p className="stat-label">Total Products</p>
            <h2 className="stat-value">{stats.totalProducts}</h2>
            <span className="stat-badge blue">Active listings</span>
          </div>
        </div>
        <div className="stat-card stat-green">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <p className="stat-label">Unique Customers</p>
            <h2 className="stat-value">{stats.totalCustomers}</h2>
            <span className="stat-badge green">+5.1% this month</span>
          </div>
        </div>
      </div>

      {/* Revenue Bars (simple visual) */}
      <div className="dashboard-grid-2">
        <div className="card-section">
          <h3 className="section-title">📊 Payment Method Breakdown</h3>
          {["COD", "UPI", "CARD"].map((method) => {
            const count = recentOrders.filter((o) => o.paymentMethod === method).length;
            const pct = recentOrders.length ? Math.round((count / recentOrders.length) * 100) : 0;
            return (
              <div key={method} className="bar-row">
                <span className="bar-label">{method}</span>
                <div className="bar-track">
                  <div className={`bar-fill bar-${method.toLowerCase()}`} style={{ width: `${pct}%` }}></div>
                </div>
                <span className="bar-pct">{pct}%</span>
              </div>
            );
          })}
        </div>

        <div className="card-section">
          <h3 className="section-title">🏆 Quick Stats</h3>
          <div className="quick-stats">
            <div className="qs-item">
              <span className="qs-icon">💳</span>
              <div>
                <p className="qs-label">Avg Order Value</p>
                <p className="qs-value">
                  ₹{stats.totalOrders > 0 ? Math.round(stats.totalRevenue / stats.totalOrders).toLocaleString("en-IN") : 0}
                </p>
              </div>
            </div>
            <div className="qs-item">
              <span className="qs-icon">🎯</span>
              <div>
                <p className="qs-label">Conversion Rate</p>
                <p className="qs-value">68.4%</p>
              </div>
            </div>
            <div className="qs-item">
              <span className="qs-icon">⭐</span>
              <div>
                <p className="qs-label">Satisfaction</p>
                <p className="qs-value">4.8 / 5</p>
              </div>
            </div>
            <div className="qs-item">
              <span className="qs-icon">🔄</span>
              <div>
                <p className="qs-label">Return Rate</p>
                <p className="qs-value">2.1%</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="card-section">
        <h3 className="section-title">🧾 Recent Orders</h3>
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>City</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr><td colSpan={7} className="empty-row">No orders yet</td></tr>
              ) : recentOrders.map((order) => (
                <tr key={order._id} className="table-row">
                  <td className="order-id">#{order._id.slice(-6).toUpperCase()}</td>
                  <td>
                    <div className="customer-cell">
                      <div className="avatar">{order.address?.name?.[0]?.toUpperCase() || "?"}</div>
                      <div>
                        <p className="cname">{order.address?.name || "N/A"}</p>
                        <p className="cphone">{order.address?.phone || ""}</p>
                      </div>
                    </div>
                  </td>
                  <td>{order.address?.city || "—"}</td>
                  <td><span className="items-badge">{order.cart?.length || 0} items</span></td>
                  <td className="amount-cell">₹{(order.totalPayable || 0).toLocaleString("en-IN")}</td>
                  <td><span className={`badge ${statusColor(order.paymentMethod)}`}>{order.paymentMethod}</span></td>
                  <td className="date-cell">{order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-IN") : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
