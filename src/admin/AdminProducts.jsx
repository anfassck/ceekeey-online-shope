import { useState, useEffect, useRef } from "react";
import "./admin.css";

const BASE = "http://localhost:8080";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);
  const fileRef = useRef();

  const [form, setForm] = useState({
    name: "", price: "", category: "", description: "", file: null,
  });

  const fetchAll = async () => {
    setLoading(true);
    const [p, c] = await Promise.all([
      fetch(`${BASE}/product`).then((r) => r.json()),
      fetch(`${BASE}/category`).then((r) => r.json()),
    ]);
    setProducts(p);
    setCategories(c);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category || !form.description) return alert("All fields required!");
    setSubmitting(true);
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("price", form.price);
    fd.append("category", form.category);
    fd.append("description", form.description);
    if (form.file) fd.append("file", form.file);

    const url = editId ? `${BASE}/product/${editId}` : `${BASE}/product`;
    const method = editId ? "PUT" : "POST";

    await fetch(url, { method, body: fd });
    setSuccess(editId ? "✅ Product updated successfully!" : "✅ Product added successfully!");
    resetForm();
    setTimeout(() => setSuccess(""), 3000);
    fetchAll();
  };

  const resetForm = () => {
    setForm({ name: "", price: "", category: "", description: "", file: null });
    setEditId(null);
    if (fileRef.current) fileRef.current.value = "";
    setShowForm(false);
    setSubmitting(false);
  };

  const handleEdit = (p) => {
    setEditId(p._id);
    setForm({
      name: p.name || "",
      price: p.price || "",
      category: p.category?._id || p.category || "",
      description: p.description || "",
      file: null
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    await fetch(`${BASE}/product/${id}`, { method: "DELETE" });
    setDeleteId(null);
    fetchAll();
  };

  const filtered = products.filter((p) => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat ? (p.category === filterCat || p.category?._id === filterCat || p.category?.name === categories.find(c => c._id === filterCat)?.name) : true;
    return matchSearch && matchCat;
  });

  return (
    <div className="admin-page">
      {success && <div className="toast toast-success">{success}</div>}

      {/* Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">🛒 Product Management</h2>
          <p className="page-sub">Manage your store's product catalog</p>
        </div>
        <button className="btn-primary" onClick={() => {
          if (showForm) resetForm();
          else setShowForm(true);
        }}>
          {showForm ? "✕ Cancel" : "+ Add Product"}
        </button>
      </div>

      {/* Add Product Form */}
      {showForm && (
        <div className="form-card">
          <h3 className="form-title">{editId ? "Edit Product" : "Add New Product"}</h3>
          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-row">
              <div className="form-group">
                <label>Product Name *</label>
                <input className="form-input" placeholder="e.g. Nike Air Max" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Price (₹) *</label>
                <input className="form-input" type="number" placeholder="e.g. 999" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Category *</label>
                <select className="form-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Product Image</label>
                <input className="form-input" type="file" accept="image/*" ref={fileRef} onChange={(e) => setForm({ ...form, file: e.target.files[0] })} />
              </div>
            </div>
            <div className="form-group">
              <label>Description *</label>
              <textarea className="form-input form-textarea" placeholder="Describe your product..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <button type="submit" className="btn-primary btn-full" disabled={submitting}>
              {submitting ? (editId ? "Updating..." : "Adding...") : (editId ? "Update Product" : "Add Product")}
            </button>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="filter-bar">
        <input className="search-input" placeholder="🔍 Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="filter-select" value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <span className="count-badge">{filtered.length} products</span>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="admin-loading"><div className="spinner"></div></div>
      ) : (
        <div className="product-grid">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <span>📭</span>
              <p>No products found</p>
            </div>
          ) : filtered.map((p) => (
            <div key={p._id} className="product-card-admin">
              <div className="product-img-wrap">
                {p.image ? (
                  <img src={p.image} alt={p.name} className="product-img-admin" />
                ) : (
                  <div className="product-img-placeholder">🖼️</div>
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  <button className="btn-ghost" 
                          style={{ padding: "4px", background: "#f1f3f6", borderRadius: "50%", width: 32, height: 32 }}
                          onClick={() => handleEdit(p)}>
                    ✏️
                  </button>
                  <button className="delete-btn" style={{ position: "relative", top: 0, right: 0 }} onClick={() => setDeleteId(p._id)}>
                    🗑️
                  </button>
                </div>
              </div>
              <div className="product-card-body">
                <h4 className="product-card-name">{p.name}</h4>
                <p className="product-card-desc">{p.description?.slice(0, 60)}...</p>
                <div className="product-card-footer">
                  <span className="product-price-tag">₹{Number(p.price).toLocaleString("en-IN")}</span>
                  <span className="category-chip">{p.category?.name || "—"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-icon">⚠️</div>
            <h3>Delete Product?</h3>
            <p>This action cannot be undone. Are you sure?</p>
            <div className="modal-actions">
              <button className="btn-danger" onClick={() => handleDelete(deleteId)}>Yes, Delete</button>
              <button className="btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
