import { useState, useEffect } from "react";
import Navbar from "./Navbar";

function App() {
  const [product, setProduct] = useState([]);

  const getData = async () => {
    try {
      const res = await fetch("http://localhost:8080/product");
      const data = await res.json();
      setProduct(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
  <div className="app-container">
    {/* ✅ Navbar at the top */}
    <Navbar />

    {product.length === 0 ? (
      <p className="loading-text">Loading products...</p>
    ) : (
      <>
        <h2 className="product-count">Total Products: {product.length}</h2>

        <div className="product-container">
          {product.map((item) => (
            <div className="product-card" key={item._id}>
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="product-image"
                />
              )}
              <div className="product-info">
                <h3 className="product-name">{item.name}</h3>
                <p className="product-category">{item.category}</p>
                <p className="product-price">₹{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      </>
    )}
  </div>
);


  
}

export default App;
