import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ceekeey.css";
import productStore from "./CartStore";

const BASE = "http://localhost:8080";

const ProductsSection = ({ searchedproduct }) => {
  const navigate = useNavigate();
  const { setCart } = productStore();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetch(`${BASE}/product`)
      .then((r) => r.json())
      .then((data) => { setProducts(Array.isArray(data) ? data : [data]); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (searchedproduct && searchedproduct.length > 0) {
      setProducts(searchedproduct);
    }
  }, [searchedproduct]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    setCart({ id: product._id, name: product.name, price: product.price, image: product.image, quantity: 1 });
    showToast(`✅ ${product.name} added to cart!`);
  };

  // Simulate discount (10–40%)
  const getDiscount = (id) => {
    const discounts = [10, 15, 18, 22, 25, 30, 35, 40];
    const idx = id.charCodeAt(id.length - 1) % discounts.length;
    return discounts[idx];
  };

  const getRating = (id) => {
    const ratings = ["4.1 ★", "4.3 ★", "4.5 ★", "3.9 ★", "4.7 ★", "4.2 ★"];
    return ratings[id.charCodeAt(0) % ratings.length];
  };

  if (loading) return (
    <div className="ck-loading">
      <div className="ck-spinner" />
      <p>Loading amazing products...</p>
    </div>
  );

  if (!products.length) return (
    <div className="ck-empty">
      <span className="ck-empty-icon">🛍️</span>
      <p>No products found right now.</p>
    </div>
  );

  return (
    <>
      <div className="ck-section">
        {/* Section Header */}
        <div className="ck-section-header">
          <h2 className="ck-section-title">Featured Products</h2>
          <span style={{ fontSize: 13, color: "#878787" }}>{products.length} products</span>
        </div>

        {/* Product Grid */}
        <div className="ck-products-grid">
          {products.map((product) => {
            const disc = getDiscount(product._id);
            const mrp = Math.round(product.price * 100 / (100 - disc));
            return (
              <div
                key={product._id}
                className="ck-product-card"
                onClick={() => navigate(`/product/details/${product._id}`)}
              >
                <div className="ck-product-img-wrap">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="ck-product-img"
                    />
                  ) : (
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48 }}>📦</div>
                  )}
                </div>

                <p className="ck-product-name">{product.name}</p>

                <div className="ck-product-rating">{getRating(product._id)}</div>

                <p className="ck-product-price">₹{Number(product.price).toLocaleString("en-IN")}</p>
                <p className="ck-product-mrp">₹{mrp.toLocaleString("en-IN")}</p>
                <p className="ck-product-discount">{disc}% off</p>

                <button
                  className="ck-add-cart"
                  onClick={(e) => handleAddToCart(e, product)}
                >
                  🛒 Add to Cart
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {toast && <div className="ck-toast">{toast}</div>}
    </>
  );
};

export default ProductsSection;
