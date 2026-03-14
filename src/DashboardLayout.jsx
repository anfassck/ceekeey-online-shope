import React, { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation, Navigate } from "react-router-dom";
import "./admin/admin.css";

const navItems = [
  { to: "/dashboard", label: "Overview", icon: "📊", end: true },
  { to: "/dashboard/orders", label: "Orders", icon: "📦" },
  { to: "/dashboard/products", label: "Products", icon: "🛒" },
  { to: "/dashboard/customers", label: "Customers", icon: "👥" },
  { to: "/dashboard/sales", label: "Sales Analytics", icon: "📈" },
  { to: "/dashboard/uploads", label: "Add Product", icon: "➕" },
  { to: "/dashboard/categories", label: "Categories", icon: "🗂️" },
  { to: "/dashboard/sliders", label: "Banners / Sliders", icon: "🖼️" },
];

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user || user.email !== "admin@gmail.com") {
    return <Navigate to="/" replace />;
  }

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/dashboard") return { title: "Dashboard Overview", sub: "Welcome to your admin control center" };
    if (path.includes("orders")) return { title: "Orders Management", sub: "Track and manage all customer orders" };
    if (path.includes("products")) return { title: "Product Management", sub: "Manage your store's product catalog" };
    if (path.includes("customers")) return { title: "Customer Management", sub: "View all registered customers" };
    if (path.includes("sales")) return { title: "Sales Analytics", sub: "Deep dive into your revenue and performance" };
    if (path.includes("uploads")) return { title: "Add Product", sub: "Upload new products to your store" };
    if (path.includes("uploader")) return { title: "Categories (Old)", sub: "Manage product categories" };
    if (path.includes("categories")) return { title: "Category Management", sub: "Add, view and delete product categories" };
    if (path.includes("sliders")) return { title: "Banner Sliders", sub: "Manage homepage promotional banners" };
    if (path.includes("uploade")) return { title: "Banners (Old)", sub: "Manage promotional banners" };
    return { title: "Dashboard", sub: "" };
  };

  const { title, sub } = getPageTitle();

  return (
    <div className="dashboard-shell">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="brand-icon">🏪</div>
          <div>
            <p className="brand-name">Ceekeey Admin</p>
            <p className="brand-tag">E-Commerce Platform</p>
          </div>
        </div>

        {/* Nav */}
        <p className="sidebar-section-label">Main Menu</p>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `admin-nav-link${isActive ? " active" : ""}`
              }
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <p className="sidebar-section-label">Settings</p>
        <nav className="sidebar-nav" style={{ flex: "unset" }}>
          <NavLink
            to="/"
            className="admin-nav-link"
          >
            <span className="nav-icon">🏠</span>
            Go to Store
          </NavLink>
        </nav>

        {/* Sidebar Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">A</div>
            <div className="sidebar-user-info">
              <p>Administrator</p>
              <span>● Online</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="admin-main">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="topbar-left">
            <h1>{title}</h1>
            <p>{sub}</p>
          </div>
          <div className="topbar-right">
            <div className="topbar-btn" title="Notifications">
              🔔
              <span className="notif-dot"></span>
            </div>
            <div className="topbar-btn" title="Settings">⚙️</div>
            <div className="topbar-profile">
              <div className="topbar-profile-avatar" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>A</div>
              <div>
                <p className="profile-name">Admin</p>
                <p className="profile-role">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <div className="admin-scroll">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
