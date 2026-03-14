import { useState, useEffect, useRef } from "react";
import "./admin.css";

const BASE = "http://localhost:8080";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [img, setImg] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [toast, setToast] = useState("");
  const fileRef = useRef();

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE}/category`);
      const data = await res.json();
      setCategories(data);
      setLoading(false);
    } catch (error) {
      console.error("Fetch error:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add category
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) {
      alert("Category name required");
      return;
    }

    try {
      setSubmitting(true);

      const fd = new FormData();
      fd.append("name", name);
      if (img) fd.append("image", img);

      const url = editId ? `${BASE}/category/${editId}` : `${BASE}/category`;
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: fd,
      });

      if (!res.ok) throw new Error("Save failed");

      resetForm();
      showToast(editId ? "✅ Category updated" : "✅ Category added");

      fetchCategories();
    } catch (error) {
      console.error(error);
      alert("Error saving category");
    }

    setSubmitting(false);
  };

  const resetForm = () => {
    setName(""); setImg(null); setPreview(null); setEditId(null);
    if (fileRef.current) fileRef.current.value = "";
    setShowForm(false);
  };

  const handleEdit = (cat) => {
    setEditId(cat._id);
    setName(cat.name || "");
    setImg(null);
    setPreview(`${BASE}${cat.image || ""}`);
    setShowForm(true);
  };

  // Delete category
 const handleDelete = async (id) => {
  try {
    const res = await fetch(`${BASE}/category/${id}`, {
      method: "DELETE",
    });

    if (res.status === 404) {
      alert("Category not found on server");
      return;
    }

    if (!res.ok) throw new Error("Delete failed");

    setCategories((prev) => prev.filter((c) => c._id !== id));
    setDeleteId(null);
    showToast("🗑️ Category deleted");

  } catch (error) {
    console.error("Delete error:", error);
  }
};

  return (
    <div className="admin-page">
      {toast && <div className="toast toast-success">{toast}</div>}

      <div className="page-header">
        <div>
          <h2 className="page-title">🗂️ Category Management</h2>
          <p className="page-sub">Add, view and delete product categories</p>
        </div>

        <button
          className="btn-primary"
          onClick={() => {
            if (showForm) resetForm();
            else setShowForm(true);
          }}
        >
          {showForm ? "✕ Cancel" : "+ Add Category"}
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="form-card">
          <h3 className="form-title">{editId ? "Edit Category" : "New Category"}</h3>

          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-row">
              <div className="form-group">
                <label>Category Name *</label>

                <input
                  className="form-input"
                  placeholder="Electronics"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Category Image</label>

                <input
                  className="form-input"
                  type="file"
                  accept="image/*"
                  ref={fileRef}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setImg(file);
                    if (file) {
                      setPreview(URL.createObjectURL(file));
                    } else {
                      setPreview(null);
                    }
                  }}
                />
              </div>
            </div>

            {preview && (
              <img
                src={preview}
                alt="preview"
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 8,
                  objectFit: "cover",
                  border: "2px solid #ddd",
                  marginTop: 10,
                }}
              />
            )}

            <button
              type="submit"
              className="btn-primary btn-full"
              disabled={submitting}
            >
              {submitting ? (editId ? "Updating..." : "Adding...") : (editId ? "Update Category" : "Add Category")}
            </button>
          </form>
        </div>
      )}

      {/* Category Grid */}

      {loading ? (
        <div className="admin-loading">
          <div className="spinner" />
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))",
            gap: 16,
          }}
        >
          {categories.length === 0 ? (
            <div className="empty-state" style={{ gridColumn: "1/-1" }}>
              <span>🗂️</span>
              <p>No categories yet. Add one!</p>
            </div>
          ) : (
            categories.map((cat) => (
              <div key={cat._id} className="product-card-admin">
                <div className="product-img-wrap">
                  {cat.image ? (
                    <img
                      src={`${BASE}${cat.image}`}
                      alt={cat.name}
                      className="product-img-admin"
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  ) : (
                    <div className="product-img-placeholder">🗂️</div>
                  )}

                  <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                    <button
                      className="btn-ghost"
                      style={{ padding: "4px", background: "#f1f3f6", borderRadius: "50%", width: 32, height: 32 }}
                      onClick={() => handleEdit(cat)}
                    >
                      ✏️
                    </button>
                    <button
                      className="delete-btn"
                      style={{ position: "relative", top: 0, right: 0 }}
                      onClick={() => setDeleteId(cat._id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="product-card-body">
                  <h4 className="product-card-name">{cat.name}</h4>

                  <p className="cphone" style={{ marginTop: 4 }}>
                    {cat.createdAt
                      ? new Date(cat.createdAt).toLocaleDateString("en-IN")
                      : ""}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Delete Confirm Modal */}

      {deleteId && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-icon">⚠️</div>

            <h3>Delete Category?</h3>
            <p>This action cannot be undone.</p>

            <div className="modal-actions">
              <button
                className="btn-danger"
                onClick={() => handleDelete(deleteId)}
              >
                Delete
              </button>

              <button
                className="btn-ghost"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}