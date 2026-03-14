import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import productStore from "./CartStore";
import "./ceekeey.css";

const BASE = "http://localhost:8080";

export default function CategoryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setCart } = productStore();
  const [category, setCategory] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [sort, setSort] = useState("default");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`${BASE}/category/${id}`).then((r) => r.json()),
      fetch(`${BASE}/product?category=${id}`).then((r) => r.json()),
    ]).then(([cat, prods]) => {
      setCategory(cat);
      setProducts(prods);
      setLoading(false);
    }).catch(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [id]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    setCart({ id: product._id, name: product.name, price: product.price, image: product.image, quantity: 1 });
    showToast(`✅ ${product.name} added to cart!`);
  };

  const sorted = [...products].sort((a, b) => {
    if (sort === "low") return a.price - b.price;
    if (sort === "high") return b.price - a.price;
    if (sort === "name") return a.name.localeCompare(b.name);
    return 0;
  });

  const getDiscount = (id) => {
    const discounts = [10, 15, 18, 22, 25, 30];
    return discounts[id.charCodeAt(id.length - 1) % discounts.length];
  };

  const getRating = (id) => {
    const r = ["4.1", "4.3", "4.5", "3.9", "4.7"];
    return r[id.charCodeAt(0) % r.length];
  };

  return (
    <div style={{ background: "#f1f3f6", minHeight: "100vh" }}>
      <Navbar />

      <div className="ck-category-page">
        {/* Breadcrumb */}
        <p style={{ fontSize: 12, color: "#878787", marginBottom: 16 }}>
          <span style={{ cursor: "pointer", color: "#2874f0" }} onClick={() => navigate("/")}>Home</span>
          {" › "}
          {category.name || "Category"}
        </p>

        {loading ? (
          <div className="ck-loading"><div className="ck-spinner" /><p>Loading...</p></div>
        ) : (
          <>
            {/* Category Hero */}
            <div className="ck-category-hero">
              {category.image && (
                <img
                  src={`${BASE}${category.image}`}
                  alt={category.name}
                  onError={(e) => e.target.style.display = "none"}
                />
              )}
              <div>
                <h1>{category.name}</h1>
                <p>Explore top products from the <strong>{category.name}</strong> category. Best quality &amp; best prices guaranteed on Ceekeey!</p>
                <span className="ck-product-count">{products.length} Products Available</span>
              </div>
            </div>

            {/* Sort + filter bar */}
            <div style={{ background: "#fff", padding: "12px 20px", borderRadius: 4, border: "1px solid #e0e0e0", marginBottom: 16, display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#212121" }}>Sort By:</span>
              {[
                { val: "default", label: "Relevance" },
                { val: "low", label: "Price: Low to High" },
                { val: "high", label: "Price: High to Low" },
                { val: "name", label: "Name" },
              ].map((s) => (
                <button
                  key={s.val}
                  onClick={() => setSort(s.val)}
                  style={{
                    padding: "6px 16px",
                    borderRadius: 20,
                    border: `1px solid ${sort === s.val ? "#2874f0" : "#e0e0e0"}`,
                    background: sort === s.val ? "#2874f0" : "#fff",
                    color: sort === s.val ? "#fff" : "#212121",
                    fontSize: 13,
                    fontWeight: sort === s.val ? 600 : 400,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>

            {/* Products */}
            {sorted.length === 0 ? (
              <div className="ck-empty">
                <span className="ck-empty-icon">📭</span>
                <p>No products found in this category yet.</p>
              </div>
            ) : (
              <div className="ck-products-grid" style={{ border: "1px solid #e0e0e0", borderRadius: 4 }}>
                {sorted.map((product) => {
                  const disc = getDiscount(product._id);
                  const mrp = Math.round(product.price * 100 / (100 - disc));
                  const rating = getRating(product._id);
                  return (
                    <div
                      key={product._id}
                      className="ck-product-card"
                      onClick={() => navigate(`/product/details/${product._id}`)}
                    >
                      <div className="ck-product-img-wrap">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="ck-product-img" />
                        ) : (
                          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>📦</div>
                        )}
                      </div>
                      <p className="ck-product-name">{product.name}</p>
                      <div className="ck-product-rating">{rating} ★</div>
                      <p className="ck-product-price">₹{Number(product.price).toLocaleString("en-IN")}</p>
                      <p className="ck-product-mrp">₹{mrp.toLocaleString("en-IN")}</p>
                      <p className="ck-product-discount">{disc}% off</p>
                      <button className="ck-add-cart" onClick={(e) => handleAddToCart(e, product)}>
                        🛒 Add to Cart
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {toast && <div className="ck-toast">{toast}</div>}
    </div>
  );
}
