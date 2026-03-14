import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import ProductsSection from "./ProductsSection";
import "./ceekeey.css";

const BASE = "http://localhost:8080";

// Helper: build correct image URL (handles both seeded full URLs and local uploads)
const buildImgUrl = (img) => {
  if (!img) return "";
  if (img.startsWith("http")) return img; // Full URL (Unsplash, etc.)
  return `${BASE}${img}`; // Local upload
};

// ─── Hero Slider ──────────────────────────────────────────────
function HeroSlider({ refreshKey }) {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    fetch(`${BASE}/slideimage`)
      .then((r) => r.json())
      .then((data) => { setSlides(data); setCurrent(0); })
      .catch(() => {});
  }, [refreshKey]); // re-fetch whenever refreshKey changes

  useEffect(() => {
    if (!slides.length) return;
    const t = setInterval(() => setCurrent((p) => (p + 1) % slides.length), 4000);
    return () => clearInterval(t);
  }, [slides.length]);

  if (!slides.length) return null;

  return (
    <div className="ck-slider" style={{ height: "320px" }}>
      {slides.map((img, i) => (
        <div
          key={i}
          className="ck-slide"
          style={{ opacity: i === current ? 1 : 0, transform: i === current ? "scale(1)" : "scale(1.04)" }}
        >
          <img
            src={buildImgUrl(img.image || img.url || img)}
            alt={`Slide ${i + 1}`}
          />
        </div>
      ))}
      <div className="ck-dots">
        {slides.map((_, i) => (
          <span
            key={i}
            className={`ck-dot${i === current ? " active" : ""}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── HomeScreen ───────────────────────────────────────────────
export default function HomeScreen() {
  const [categories, setCategories] = useState([]);
  const [searchedproduct, setSearchedproduct] = useState([]);
  const [refreshKey, setRefreshKey] = useState(Date.now()); // changes on each visit
  const navigate = useNavigate();

  useEffect(() => {
    // Refresh key causes HeroSlider to re-fetch
    setRefreshKey(Date.now());
    // Also re-fetch categories fresh
    fetch(`${BASE}/category`)
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
  }, []);

  const promos = [
    { icon: "🚀", title: "Free Delivery", sub: "On orders above ₹499" },
    { icon: "↩️", title: "Easy Returns", sub: "10-day hassle-free returns" },
    { icon: "🔒", title: "Secure Payments", sub: "100% safe & encrypted" },
    { icon: "💬", title: "24/7 Support", sub: "Always here to help you" },
  ];

  return (
    <div style={{ background: "#f1f3f6", minHeight: "100vh" }}>
      <Navbar setSearchedproduct={setSearchedproduct} />

      {/* Category Strip (top) */}
      <div className="ck-category-bar">
        <div className="ck-category-inner">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="ck-cat-item"
              onClick={() => navigate(`/category/details/${cat._id}`)}
            >
              <img
                src={buildImgUrl(cat.image)}
                alt={cat.name}
                onError={(e) => { e.target.style.display = "none"; }}
              />
              <span>{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hero Slider */}
      <HeroSlider refreshKey={refreshKey} />

      {/* Promo Strip */}
      <div className="ck-promo-strip">
        {promos.map((p, i) => (
          <div key={i} className="ck-promo-card">
            <span className="ck-promo-icon">{p.icon}</span>
            <div>
              <p className="ck-promo-title">{p.title}</p>
              <p className="ck-promo-sub">{p.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Products */}
      <ProductsSection searchedproduct={searchedproduct} />

      {/* Footer */}
      <footer className="ck-footer">
        <div className="ck-footer-top" style={{ gridTemplateColumns: "repeat(5,1fr)" }}>
          {/* Brand */}
          <div className="ck-footer-col">
            <div className="ck-footer-brand">Ceekeey</div>
            <p className="ck-footer-tagline">India's favourite online shopping destination for electronics, fashion, home &amp; more.</p>
            <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
              <a href="#" style={{ background: "#1877f2", width: 32, height: 32, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, textDecoration: "none" }}>w</a>
              <a href="#" style={{ background: "#e1306c", width: 32, height: 32, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, textDecoration: "none" }}>i</a>
            </div>
          </div>

          {/* About */}
          <div className="ck-footer-col">
            <h4>About</h4>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Press</a>
            <a href="#">Corporate Info</a>
            <a href="#">Brand Story</a>
          </div>

          {/* Help */}
          <div className="ck-footer-col">
            <h4>Help</h4>
            <a href="#">Payments</a>
            <a href="#">Shipping Info</a>
            <a href="#">Cancellation &amp; Returns</a>
            <a href="#">FAQ</a>
            <a href="#">Report a Problem</a>
          </div>

          {/* Policy */}
          <div className="ck-footer-col">
            <h4>Policy</h4>
            <a href="#">Return Policy</a>
            <a href="#">Terms of Use</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Security</a>
            <a href="#">Cookie Settings</a>
          </div>

          {/* Contact */}
          <div className="ck-footer-col">
            <h4>Contact Us</h4>
            <p style={{ fontSize: 13, color: "#a0afbe", marginBottom: 8 }}>
              📞 <a href="tel:+918310059916" style={{ color: "#a0afbe", textDecoration: "none" }}>+91 83100 59916</a>
            </p>
            <p style={{ fontSize: 13, color: "#a0afbe", marginBottom: 8 }}>
              📧 <a href="mailto:ceekeey@gmail.com" style={{ color: "#a0afbe", textDecoration: "none" }}>ceekeey@gmail.com</a>
            </p>
            <p style={{ fontSize: 13, color: "#a0afbe", marginBottom: 4 }}>📍 Kerala, India</p>
            
          </div>
        </div>

        <div className="ck-footer-bottom">
          © {new Date().getFullYear()} <strong>Ceekeey Online Shopping Pvt. Ltd.</strong> — All Rights Reserved. |
          Built with  by <strong>Muhammed Anfas ck</strong>
        </div>
      </footer>
    </div>
  );
}
