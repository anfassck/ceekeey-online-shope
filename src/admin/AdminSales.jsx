import { useState, useEffect } from "react";
import "./admin.css";

const BASE = "http://localhost:8080";

export default function AdminSales() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${BASE}/order`).then((r) => r.json()),
      fetch(`${BASE}/product`).then((r) => r.json()),
    ]).then(([o, p]) => {
      setOrders(o);
      setProducts(p);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // ─── Analytics Calculations ─────────────────────────────
  const totalRevenue    = orders.reduce((s, o) => s + (o.totalPayable || 0), 0);
  const totalMRP        = orders.reduce((s, o) => s + (o.totalMRP || 0), 0);
  const totalDiscount   = orders.reduce((s, o) => s + (o.totalDiscount || 0), 0);
  const avgOrder        = orders.length ? Math.round(totalRevenue / orders.length) : 0;

  // Payment method split
  const payCount = { COD: 0, UPI: 0, CARD: 0 };
  const payRev   = { COD: 0, UPI: 0, CARD: 0 };
  orders.forEach((o) => {
    if (payCount[o.paymentMethod] !== undefined) {
      payCount[o.paymentMethod]++;
      payRev[o.paymentMethod] += o.totalPayable || 0;
    }
  });

  // Product-wise sales from cart items
  const productSales = {};
  orders.forEach((o) => {
    o.cart?.forEach((item) => {
      if (!productSales[item.id]) {
        productSales[item.id] = {
          name: item.name,
          image: item.image,
          qty: 0,
          revenue: 0,
        };
      }
      productSales[item.id].qty     += item.quantity || 1;
      productSales[item.id].revenue += (item.price || 0) * (item.quantity || 1);
    });
  });

  const topProducts = Object.values(productSales)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8);

  // City-wise breakdown
  const cityMap = {};
  orders.forEach((o) => {
    const city = o.address?.city || "Unknown";
    if (!cityMap[city]) cityMap[city] = { orders: 0, revenue: 0 };
    cityMap[city].orders++;
    cityMap[city].revenue += o.totalPayable || 0;
  });
  const topCities = Object.entries(cityMap)
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .slice(0, 5);

  // Monthly revenue (last 6 months)
  const now = new Date();
  const monthLabels = [];
  const monthRevenue = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
    monthLabels.push(label);
    const rev = orders
      .filter((o) => {
        const od = new Date(o.createdAt);
        return od.getMonth() === d.getMonth() && od.getFullYear() === d.getFullYear();
      })
      .reduce((s, o) => s + (o.totalPayable || 0), 0);
    monthRevenue.push(rev);
  }
  const maxMonthRev = Math.max(...monthRevenue, 1);

  if (loading) return <div className="admin-loading"><div className="spinner" /></div>;

  return (
    <div className="admin-page">
      {/* Page header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">📈 Sales Analytics</h2>
          <p className="page-sub">Comprehensive view of your store's performance</p>
        </div>
        <div className="header-meta">
          <div className="mini-stat">
            <span>Total Orders</span>
            <strong>{orders.length}</strong>
          </div>
          <div className="mini-stat">
            <span>Products Listed</span>
            <strong>{products.length}</strong>
          </div>
        </div>
      </div>

      {/* Revenue KPIs */}
      <div className="stats-grid">
        <div className="stat-card stat-blue">
          <div className="stat-icon">💰</div>
          <div className="stat-info">
            <p className="stat-label">Gross Revenue</p>
            <h2 className="stat-value">₹{totalRevenue.toLocaleString("en-IN")}</h2>
            <span className="stat-badge green">After discounts</span>
          </div>
        </div>
        <div className="stat-card stat-orange">
          <div className="stat-icon">🏷️</div>
          <div className="stat-info">
            <p className="stat-label">Total MRP Value</p>
            <h2 className="stat-value">₹{totalMRP.toLocaleString("en-IN")}</h2>
            <span className="stat-badge blue">Listed price sum</span>
          </div>
        </div>
        <div className="stat-card stat-purple">
          <div className="stat-icon">🎁</div>
          <div className="stat-info">
            <p className="stat-label">Total Discounts</p>
            <h2 className="stat-value">₹{totalDiscount.toLocaleString("en-IN")}</h2>
            <span className="stat-badge green">Savings given</span>
          </div>
        </div>
        <div className="stat-card stat-green">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <p className="stat-label">Avg Order Value</p>
            <h2 className="stat-value">₹{avgOrder.toLocaleString("en-IN")}</h2>
            <span className="stat-badge blue">Per transaction</span>
          </div>
        </div>
      </div>

      {/* Monthly Revenue Chart + Payment Split */}
      <div className="dashboard-grid-2">
        {/* Monthly bar chart */}
        <div className="card-section">
          <h3 className="section-title">📅 Monthly Revenue (Last 6 Months)</h3>
          <div className="month-chart">
            {monthLabels.map((label, i) => {
              const pct = Math.round((monthRevenue[i] / maxMonthRev) * 100);
              return (
                <div key={label} className="month-col">
                  <div className="month-bar-track">
                    <div
                      className="month-bar-fill"
                      style={{ height: `${pct}%` }}
                      title={`₹${monthRevenue[i].toLocaleString("en-IN")}`}
                    />
                  </div>
                  <p className="month-value">
                    {monthRevenue[i] > 0 ? `₹${(monthRevenue[i] / 1000).toFixed(1)}k` : "—"}
                  </p>
                  <p className="month-label">{label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment method revenue split */}
        <div className="card-section">
          <h3 className="section-title">💳 Revenue by Payment Method</h3>
          {Object.entries(payRev).map(([method, rev]) => {
            const pct = totalRevenue ? Math.round((rev / totalRevenue) * 100) : 0;
            return (
              <div key={method} className="pay-split-row">
                <div className="pay-split-label">
                  <span className={`badge badge-${method.toLowerCase()}`}>{method}</span>
                  <span className="pay-orders">{payCount[method]} orders</span>
                </div>
                <div className="bar-track" style={{ flex: 1 }}>
                  <div
                    className={`bar-fill bar-${method.toLowerCase()}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="pay-split-right">
                  <span className="pay-rev">₹{rev.toLocaleString("en-IN")}</span>
                  <span className="bar-pct">{pct}%</span>
                </div>
              </div>
            );
          })}

          <div style={{ marginTop: 24, borderTop: "1px solid var(--border)", paddingTop: 16 }}>
            <h3 className="section-title">🏙️ Top Cities by Revenue</h3>
            {topCities.length === 0 ? (
              <p style={{ color: "var(--text-dim)", fontSize: 13 }}>No data yet</p>
            ) : topCities.map(([city, data], i) => (
              <div key={city} className="city-row">
                <span className="city-rank">#{i + 1}</span>
                <span className="city-name">{city}</span>
                <span className="city-orders">{data.orders} orders</span>
                <span className="city-rev">₹{data.revenue.toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Selling Products */}
      <div className="card-section">
        <h3 className="section-title">🏆 Top Selling Products</h3>
        {topProducts.length === 0 ? (
          <div className="empty-state">
            <span>📭</span>
            <p>No sales data yet. Sell something!</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Product</th>
                  <th>Units Sold</th>
                  <th>Revenue</th>
                  <th>Share</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p, i) => {
                  const sharePct = totalRevenue ? Math.round((p.revenue / totalRevenue) * 100) : 0;
                  return (
                    <tr key={i} className="table-row">
                      <td>
                        <span className="rank-medal">
                          {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                        </span>
                      </td>
                      <td>
                        <div className="customer-cell">
                          {p.image ? (
                            <img
                              src={p.image}
                              alt={p.name}
                              style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 8 }}
                            />
                          ) : (
                            <div
                              style={{
                                width: 40, height: 40, borderRadius: 8,
                                background: "var(--surface2)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 20,
                              }}
                            >
                              🛒
                            </div>
                          )}
                          <span className="cname">{p.name}</span>
                        </div>
                      </td>
                      <td><span className="items-badge">{p.qty} units</span></td>
                      <td className="amount-cell">₹{p.revenue.toLocaleString("en-IN")}</td>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div className="bar-track" style={{ width: 100 }}>
                            <div
                              className="bar-fill bar-upi"
                              style={{ width: `${sharePct}%` }}
                            />
                          </div>
                          <span className="bar-pct">{sharePct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
