import { useState, useEffect, useRef } from "react";
import "./admin.css";

const BASE = "http://localhost:8080";

export default function AdminSliders() {
  const [sliders, setSliders] = useState([]);
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

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const fetchSliders = () => {
    setLoading(true);
    fetch(`${BASE}/slideimage`)
      .then((r) => r.json())
      .then((d) => { setSliders(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  };

  useEffect(() => { fetchSliders(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return alert("Title is required!");
    if (!editId && !img) return alert("Image is required for new banners!");
    
    setSubmitting(true);
    const fd = new FormData();
    fd.append("name", name);
    if (img) fd.append("image", img);

    const url = editId ? `${BASE}/slideimage/${editId}` : `${BASE}/slideimage`;
    const method = editId ? "PUT" : "POST";

    await fetch(url, { method, body: fd });
    resetForm();
    showToast(editId ? "✅ Banner updated!" : "✅ Banner slide added!");
    fetchSliders();
  };

  const resetForm = () => {
    setName(""); setImg(null); setPreview(null); setEditId(null);
    if (fileRef.current) fileRef.current.value = "";
    setShowForm(false); setSubmitting(false);
  };

  const handleEdit = (slide) => {
    setEditId(slide._id);
    setName(slide.name || "");
    setImg(null);
    setPreview(`${BASE}${slide.image || slide.url || ""}`);
    setShowForm(true);
  };

  return (
    <div className="admin-page">
      {toast && <div className="toast toast-success">{toast}</div>}

      <div className="page-header">
        <div>
          <h2 className="page-title">🖼️ Banner Sliders</h2>
          <p className="page-sub">Manage homepage promotional banner images</p>
        </div>
        <button className="btn-primary" onClick={() => {
          if (showForm) resetForm();
          else setShowForm(true);
        }}>
          {showForm ? "✕ Cancel" : "+ Add Banner"}
        </button>
      </div>

      {/* Upload Form */}
      {showForm && (
        <div className="form-card">
          <h3 className="form-title">{editId ? "Edit Banner" : "Upload New Banner"}</h3>
          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-row">
              <div className="form-group">
                <label>Banner Title *</label>
                <input className="form-input" placeholder="e.g. Summer Sale 2024" value={name}
                  onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Banner Image * (wide format recommended)</label>
                <input className="form-input" type="file" accept="image/*" ref={fileRef}
                  onChange={(e) => {
                    setImg(e.target.files[0]);
                    setPreview(e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : null);
                  }} />
              </div>
            </div>
            {preview && (
              <img src={preview} alt="preview"
                style={{ width: "100%", maxHeight: 200, borderRadius: 8, objectFit: "cover", border: "2px solid var(--border)" }} />
            )}
            <button type="submit" className="btn-primary btn-full" disabled={submitting}>
              {submitting ? (editId ? "Updating..." : "Uploading...") : (editId ? "Update Banner" : "Upload Banner")}
            </button>
          </form>
        </div>
      )}

      {/* Sliders Grid */}
      {loading ? (
        <div className="admin-loading"><div className="spinner" /></div>
      ) : sliders.length === 0 ? (
        <div className="empty-state">
          <span>🖼️</span><p>No banners yet. Add a slider image!</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
          {sliders.map((slide, i) => (
            <div key={slide._id || i} className="card-section" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ position: "relative" }}>
                <img
                  src={`${BASE}${slide.image || slide.url || ""}`}
                  alt={slide.name || `Slide ${i + 1}`}
                  style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }}
                  onError={(e) => { e.target.style.background = "#1a1d27"; e.target.alt = "Image not found"; }}
                />
                <div style={{
                  position: "absolute", inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)",
                  display: "flex", alignItems: "flex-end", padding: 16
                }}>
                  <div>
                    <p style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>{slide.name || `Slide ${i + 1}`}</p>
                    <p style={{ color: "#cbd5e1", fontSize: 12 }}>
                      {slide.createdAt ? new Date(slide.createdAt).toLocaleDateString("en-IN") : ""}
                    </p>
                  </div>
                </div>
              </div>
              <div style={{ padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="items-badge">Slide #{i + 1}</span>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button className="btn-ghost" style={{ padding: "6px 12px", fontSize: 12, border: "1px solid #e0e0e0" }}
                    onClick={() => handleEdit(slide)}>
                    ✏️ Edit
                  </button>
                  <button className="btn-danger" style={{ padding: "6px 12px", fontSize: 12 }}
                    onClick={() => setDeleteId(slide._id)}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-icon">⚠️</div>
            <h3>Delete Banner?</h3>
            <p>This will remove the slide from the homepage.</p>
            <div className="modal-actions">
              <button className="btn-danger" onClick={async () => {
                if (deleteId) {
                  await fetch(`${BASE}/slideimage/${deleteId}`, { method: "DELETE" });
                }
                setDeleteId(null);
                showToast("🗑️ Slide deleted.");
                fetchSliders();
              }}>Delete</button>
              <button className="btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
