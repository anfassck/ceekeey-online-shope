import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import productStore from "./CartStore";
import "./ceekeey.css";

const BASE = "http://localhost:8080";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setCart } = productStore();
  const [product, setProduct] = useState(null);
  const [toast, setToast] = useState("");
  const [related, setRelated] = useState([]);

  useEffect(() => {
    fetch(`${BASE}/product/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setProduct(data);
        // Fetch related products
        if (data?.category?._id || data?.category) {
          const catId = data.category?._id || data.category;
          fetch(`${BASE}/product?category=${catId}`)
            .then((r) => r.json())
            .then((rel) => setRelated(rel.filter((p) => p._id !== id).slice(0, 5)));
        }
      });
    window.scrollTo(0, 0);
  }, [id]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  if (!product) return (
    <div>
      <Navbar />
      <div className="ck-loading"><div className="ck-spinner" /><p>Loading product...</p></div>
    </div>
  );

  // Simulated pricing
  const discPct = (product._id.charCodeAt(product._id.length - 1) % 4) * 5 + 10;
  const mrp = Math.round(product.price * 100 / (100 - discPct));
  const savings = mrp - product.price;

  const features = [
    { icon: "🏷️", label: "Price", value: `₹${Number(product.price).toLocaleString("en-IN")}` },
    { icon: "🏪", label: "Store", value: "Ceekeey Retail" },
    { icon: "🚀", label: "Delivery", value: "Free delivery available" },
    { icon: "↩️", label: "Returns", value: "10 days return & exchange" },
    { icon: "🔒", label: "Warranty", value: "1 Year manufacturer warranty" },
  ];

  const handleAddToCart = () => {
    setCart({ id: product._id, name: product.name, price: product.price, image: product.image, quantity: 1 });
    showToast(`✅ ${product.name} added to cart!`);
  };

  const handleBuyNow = () => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/auth", {
        state: {
          from: `/product/details/${product._id}`,
          tab: "login",
          product: { id: product._id, name: product.name, price: product.price, image: product.image, quantity: 1 }
        }
      });
      return;
    }
    navigate("/address", {
      state: { product: { id: product._id, name: product.name, price: product.price, image: product.image, quantity: 1 } },
    });
  };

  return (
    <div style={{ background: "#f1f3f6", minHeight: "100vh" }}>
      <Navbar />

      <div className="ck-detail-page">
        {/* Breadcrumb */}
        <p style={{ fontSize: 12, color: "#878787", marginBottom: 12 }}>
          <span style={{ cursor: "pointer", color: "#2874f0" }} onClick={() => navigate("/")}>Home</span>
          {" › "}
          <span style={{ cursor: "pointer", color: "#2874f0" }} onClick={() => navigate(-1)}>Products</span>
          {" › "}
          {product.name}
        </p>

        {/* Main product card */}
        <div className="ck-detail-card">
          {/* Left: Image + actions */}
          <div className="ck-detail-left">
            <img
              src={product.image || ""}
              alt={product.name}
              className="ck-detail-img"
              onError={(e) => { e.target.src = ""; e.target.style.display = "none"; }}
            />
            <div className="ck-detail-actions">
              <button className="ck-btn-cart" onClick={handleAddToCart}>🛒 Add to Cart</button>
              <button className="ck-btn-buy" onClick={handleBuyNow}>⚡ Buy Now</button>
            </div>
          </div>

          {/* Right: Info */}
          <div className="ck-detail-right">
            <h1 className="ck-detail-title">{product.name}</h1>

            {/* Rating */}
            <div className="ck-detail-rating">
              <span className="ck-rating-chip">4.3 ★</span>
              <span className="ck-rating-count">2,481 Ratings & 312 Reviews</span>
            </div>

            {/* Price block */}
            <div className="ck-detail-price-row">
              <p className="ck-detail-discount-pct">{discPct}% off</p>
              <p className="ck-detail-price">₹{Number(product.price).toLocaleString("en-IN")}</p>
              <p className="ck-detail-mrp">
                M.R.P: <span>₹{mrp.toLocaleString("en-IN")}</span>
                {" "}
                <span style={{ color: "#388e3c", fontWeight: 600 }}>(Save ₹{savings.toLocaleString("en-IN")})</span>
              </p>
            </div>

            {/* Features */}
            <div className="ck-detail-feature">
              {features.map((f, i) => (
                <div key={i} className="ck-detail-feature-row">
                  <span className="ck-feature-icon">{f.icon}</span>
                  <span className="ck-feature-label">{f.label}</span>
                  <span className="ck-feature-value">{f.value}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            <h3 className="ck-detail-desc-title">Product Description</h3>
            <p className="ck-detail-desc">
              {product.description || "High quality product available exclusively on Ceekeey. Best price guaranteed."}
            </p>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div className="ck-section-header">
              <h2 className="ck-section-title">Similar Products</h2>
            </div>
            <div className="ck-products-grid">
              {related.map((p) => {
                const d = (p._id.charCodeAt(p._id.length - 1) % 4) * 5 + 10;
                const m = Math.round(p.price * 100 / (100 - d));
                return (
                  <div key={p._id} className="ck-product-card" onClick={() => navigate(`/product/details/${p._id}`)}>
                    <div className="ck-product-img-wrap">
                      {p.image && <img src={p.image} alt={p.name} className="ck-product-img" />}
                    </div>
                    <p className="ck-product-name">{p.name}</p>
                    <p className="ck-product-price">₹{Number(p.price).toLocaleString("en-IN")}</p>
                    <p className="ck-product-mrp">₹{m.toLocaleString("en-IN")}</p>
                    <p className="ck-product-discount">{d}% off</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {toast && <div className="ck-toast">{toast}</div>}
    </div>
  );
}
