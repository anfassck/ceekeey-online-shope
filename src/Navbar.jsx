import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ceekeey.css";
import productStore from "./CartStore";

const BASE = "http://localhost:8080";

const Navbar = ({ setSearchedproduct }) => {
  const { totalQuantity } = productStore();
  const userdetails = localStorage.getItem("user");
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [toast, setToast] = useState("");
  const searchRef = useRef();
  const suggestRef = useRef();

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({ fullname: "", phone: "", email: "", password: "" });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  // ─── Live Search Suggestions ──────────────────────────────
  useEffect(() => {
    if (!query.trim()) { setSuggestions([]); setShowSuggestions(false); return; }
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`${BASE}/product/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setSuggestions(data.slice(0, 8));
        setShowSuggestions(true);
      } catch { }
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e) => {
      if (suggestRef.current && !suggestRef.current.contains(e.target) &&
        searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = async (q = query) => {
    if (!q.trim()) return;
    setShowSuggestions(false);
    try {
      const res = await fetch(`${BASE}/product/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (typeof setSearchedproduct === "function") setSearchedproduct(data);
    } catch { }
  };

  const handleSuggestionClick = (product) => {
    setQuery(product.name);
    setShowSuggestions(false);
    navigate(`/product/details/${product._id}`);
  };

  // ─── Login ────────────────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault(); setLoginError("");
    try {
      const res = await fetch(`${BASE}/login`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setShowLogin(false);
        setLoginForm({ email: "", password: "" });
        showToast(`🎉 Welcome back, ${data.user.fullname}!`);
        // Force the app to use the updated user details so profile picture updates right away
        window.location.reload();
      } else { setLoginError(data.message || "Invalid email or password."); }
    } catch { setLoginError("Cannot connect to server."); }
  };

  // ─── Signup ───────────────────────────────────────────────
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE}/signup`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupForm),
      });
      const data = await res.json();
      if (res.ok) {
        setShowSignup(false);
        setSignupForm({ fullname: "", phone: "", email: "", password: "" });
        showToast("✅ Account created! Please login.");
        setShowLogin(true);
      } else { alert(data.message || "Signup failed."); }
    } catch { alert("Cannot connect to server."); }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    showToast("Logged out successfully.");
    navigate("/");
    window.location.reload();
  };

  const user = userdetails ? JSON.parse(userdetails) : null;

  return (
    <>
      {/* ── NAVBAR ── */}
      <nav className="ck-navbar">
        <div className="ck-navbar-inner">
          {/* Brand */}
          <div className="ck-brand" onClick={() => navigate("/")}>
            <span className="ck-brand-name">Ceekeey</span>
            <span className="ck-brand-tagline">Explore Plus ⭐</span>
          </div>

          {/* Search with live suggestions */}
          <div style={{ flex: 1, maxWidth: 600, position: "relative" }}>
            <div className="ck-search" ref={searchRef}>
              <input
                type="text"
                placeholder="Search for products, brands and more"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                onFocus={() => query && setSuggestions(suggestions)}
              />
              <button className="ck-search-btn" onClick={() => handleSearch()}>🔍</button>
            </div>

            {/* Search Suggestion Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div ref={suggestRef} className="ck-search-dropdown">
                {suggestions.map((product) => {
                  const disc = (product._id.charCodeAt(product._id.length - 1) % 4) * 5 + 10;
                  const mrp = Math.round(product.price * 100 / (100 - disc));
                  return (
                    <div
                      key={product._id}
                      className="ck-search-item"
                      onClick={() => handleSuggestionClick(product)}
                    >
                      <div className="ck-search-item-img">
                        {product.image
                          ? <img src={product.image} alt={product.name} />
                          : <span>📦</span>
                        }
                      </div>
                      <div className="ck-search-item-info">
                        <p className="ck-search-item-name">{product.name}</p>
                        <div className="ck-search-item-price-row">
                          <span className="ck-search-price">₹{Number(product.price).toLocaleString("en-IN")}</span>
                          <span className="ck-search-mrp">₹{mrp.toLocaleString("en-IN")}</span>
                          <span className="ck-search-disc">{disc}% off</span>
                        </div>
                      </div>
                      <span className="ck-search-arrow">›</span>
                    </div>
                  );
                })}
                <div className="ck-search-footer" onClick={() => handleSearch()}>
                  🔍 See all results for "<strong>{query}</strong>"
                </div>
              </div>
            )}
          </div>

          {/* Nav Actions */}
          <div className="ck-nav-actions">
            {/* Login / User */}
            {!user ? (
              <button className="ck-nav-btn" onClick={() => navigate("/auth")}>
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                  </svg>
                <span className="nav-label">Login</span>
              </button>
            ) : (
              <div className="ck-dropdown"
                onMouseEnter={() => setShowUserMenu(true)}
                onMouseLeave={() => setShowUserMenu(false)}>
                <button className="ck-nav-btn" onClick={() => navigate("/profile")}>
                  {user.profileImage ? (
                    <img 
                      src={user.profileImage.startsWith("http") ? user.profileImage : `${BASE}${user.profileImage}`} 
                      alt="Profile" 
                      style={{ width: 22, height: 22, borderRadius: "50%", objectFit: "cover" }} 
                    />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                      <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                    </svg>
                  )}
                  <span className="nav-label">{user.fullname.split(" ")[0]} ▾</span>
                </button>
                {showUserMenu && (
                  <div className="ck-dropdown-menu">
                    <a href="/profile">👤 My Profile</a>
                    <a href="/orders">📦 My Orders</a>
                    {user.email === "admin@gmail.com" && (
                      <a href="/dashboard" style={{ color: "#2874f0", fontWeight: 700 }}>⚙️ Admin Panel</a>
                    )}
                    <button onClick={handleLogout}>🚪 Logout</button>
                  </div>
                )}
              </div>
            )}

            <button className="ck-nav-btn" onClick={() => navigate("/orders")}>
              {/* Box/orders icon */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zm-.5 1.5 1.96 2.5H17V9.5h2.5zM6 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2.22-3c-.55-.61-1.33-1-2.22-1s-1.67.39-2.22 1H3V6h12v9H8.22zM18 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
              </svg>
              <span className="nav-label">Orders</span>
            </button>

            <button className="ck-nav-btn ck-cart-btn" onClick={() => navigate("/cart")}>
              {/* Cart icon */}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM5.17 5H20l-1.68 8.39A2 2 0 0 1 16.38 15H7.62a2 2 0 0 1-1.96-1.64L4.26 5H2V3h3.17zM5.46 7l1.2 6h9.68l1.2-6H5.46z"/>
              </svg>
              <span className="nav-label">Cart {totalQuantity > 0 && <span style={{ background: "#ff6161", color: "#fff", borderRadius: "50%", padding: "1px 6px", fontSize: 11, fontWeight: 700, marginLeft: 4 }}>{totalQuantity}</span>}</span>
            </button>
          </div>
        </div>
      </nav>



      {/* ── TOAST ── */}
      {toast && <div className="ck-toast">{toast}</div>}
    </>
  );
};

export default Navbar;
