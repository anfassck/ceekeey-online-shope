import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import "./ceekeey.css";

const BASE = "http://localhost:8080";

const MyProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const fileRef = useRef();
  const [formData, setFormData] = useState({ fullname: "", email: "", phone: "" });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
      setFormData({ fullname: parsed.fullname || "", email: parsed.email || "", phone: parsed.phone || "" });
      setProfileImageUrl(parsed.profileImage || null);
    }
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setProfileImageUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const form = new FormData();
      form.append("fullname", formData.fullname);
      form.append("email", formData.email);
      form.append("phone", formData.phone);
      if (profileImageFile) form.append("profileImage", profileImageFile);

      const res = await fetch(`${BASE}/user/${user._id}`, { method: "PUT", body: form });
      const data = await res.json();
      if (res.ok) {
        const imgUrl = data.user?.profileImage
          ? `${BASE}${data.user.profileImage}`
          : profileImageUrl;
        const updated = { ...data.user, profileImage: imgUrl };
        localStorage.setItem("user", JSON.stringify(updated));
        setUser(updated);
        setProfileImageUrl(imgUrl);
        setEditMode(false);
        setProfileImageFile(null);
        showToast("✅ Profile updated successfully!");
      } else { showToast("❌ " + (data.message || "Failed to update")); }
    } catch { showToast("❌ Server error."); }
    setSaving(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    showToast("You have been logged out.");
    setTimeout(() => { navigate("/"); window.location.reload(); }, 1200);
  };

  if (!user) return (
    <div>
      <Navbar />
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>🔐</div>
        <h2 style={{ color: "#212121" }}>Please Login</h2>
        <p style={{ color: "#757575", marginBottom: 24 }}>Log in to view and manage your profile</p>
        <button onClick={() => navigate("/auth")} style={{ background: "#2874f0", color: "#fff", border: "none", padding: "13px 32px", borderRadius: 4, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
          Login / Sign Up
        </button>
      </div>
    </div>
  );

  const initials = user.fullname ? user.fullname.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "?";

  const fields = [
    { label: "Full Name", key: "fullname", type: "text", icon: "👤" },
    { label: "Email Address", key: "email", type: "email", icon: "📧" },
    { label: "Mobile Number", key: "phone", type: "tel", icon: "📞" },
  ];

  return (
    <div style={{ background: "#f1f3f6", minHeight: "100vh" }}>
      <Navbar />
      {toast && <div className="ck-toast">{toast}</div>}
      {showLogoutConfirm && (
        <div className="ck-modal-overlay" onClick={() => setShowLogoutConfirm(false)}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 36, maxWidth: 360, width: "90%", textAlign: "center", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>👋</div>
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Logout?</h3>
            <p style={{ color: "#757575", marginBottom: 24 }}>You will be signed out of your Ceekeey account.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button onClick={handleLogout} style={{ background: "#f44336", color: "#fff", border: "none", padding: "12px 28px", borderRadius: 6, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Yes, Logout</button>
              <button onClick={() => setShowLogoutConfirm(false)} style={{ background: "#fff", color: "#333", border: "1px solid #ddd", padding: "12px 24px", borderRadius: 6, fontSize: 14, cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 960, margin: "24px auto", padding: "0 16px", display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>

        {/* ── Left Sidebar ── */}
        <div style={{ width: 260, background: "#fff", borderRadius: 4, border: "1px solid #e0e0e0", overflow: "hidden", flexShrink: 0 }}>
          {/* Avatar */}
          <div style={{ background: "linear-gradient(135deg, #2874f0, #1a5ecf)", padding: "32px 20px", textAlign: "center" }}>
            <div style={{ position: "relative", display: "inline-block" }}>
              <div style={{
                width: 90, height: 90, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.5)",
                overflow: "hidden", margin: "0 auto 12px",
                background: "#1a5ecf", display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                {profileImageUrl && !profileImageUrl.startsWith("data:")
                  ? <img src={profileImageUrl} alt="dp" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  : profileImageUrl
                    ? <img src={profileImageUrl} alt="dp" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <span style={{ fontSize: 32, fontWeight: 800, color: "#fff" }}>{initials}</span>
                }
              </div>
              {editMode && (
                <button onClick={() => fileRef.current?.click()}
                  style={{
                    position: "absolute", bottom: 12, right: -4, width: 28, height: 28,
                    borderRadius: "50%", background: "#fff", border: "2px solid #e0e0e0",
                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14
                  }}>📷</button>
              )}
              <input type="file" accept="image/*" ref={fileRef} style={{ display: "none" }} onChange={handleImageChange} />
            </div>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 2 }}>{user.fullname}</p>
            <p style={{ color: "#c9d8ff", fontSize: 12 }}>{user.email}</p>
          </div>

          {/* Sidebar Links */}
          {["📦 My Orders", "📍 Saved Addresses", "💳 Payment Methods", "❤️ Wishlist"].map(item => (
            <div key={item} style={{ padding: "14px 20px", borderBottom: "1px solid #f5f5f5", fontSize: 13, color: "#444", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}
              onMouseEnter={e => e.currentTarget.style.background = "#f5f5f5"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              {item}
            </div>
          ))}
          <div onClick={() => setShowLogoutConfirm(true)}
            style={{ padding: "14px 20px", fontSize: 13, color: "#f44336", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, fontWeight: 700 }}
            onMouseEnter={e => e.currentTarget.style.background = "#fff5f5"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            🚪 Logout
          </div>
        </div>

        {/* ── Right: Profile Info ── */}
        <div style={{ flex: 1, minWidth: 280 }}>
          <div style={{ background: "#fff", borderRadius: 4, border: "1px solid #e0e0e0", overflow: "hidden" }}>
            {/* Header */}
            <div style={{ padding: "20px 24px", borderBottom: "1px solid #f0f0f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <h2 style={{ fontSize: 17, fontWeight: 700, color: "#212121", marginBottom: 2 }}>Personal Information</h2>
                <p style={{ fontSize: 12, color: "#878787" }}>Manage and protect your account</p>
              </div>
              {!editMode ? (
                <button onClick={() => setEditMode(true)}
                  style={{ background: "none", border: "1px solid #2874f0", color: "#2874f0", padding: "8px 20px", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "inherit" }}>
                  ✏️ Edit Profile
                </button>
              ) : (
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={handleSave} disabled={saving}
                    style={{ background: "#2874f0", color: "#fff", border: "none", padding: "8px 20px", borderRadius: 4, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "inherit" }}>
                    {saving ? "Saving..." : "💾 Save"}
                  </button>
                  <button onClick={() => { setEditMode(false); setProfileImageFile(null); }}
                    style={{ background: "#fff", color: "#444", border: "1px solid #ddd", padding: "8px 16px", borderRadius: 4, cursor: "pointer", fontSize: 13, fontFamily: "inherit" }}>
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Fields */}
            <div style={{ padding: 24 }}>
              {fields.map(({ label, key, type, icon }) => (
                <div key={key} style={{ marginBottom: 24 }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#878787", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {icon} {label}
                  </label>
                  {editMode ? (
                    <input type={type} value={formData[key]}
                      onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                      style={{ width: "100%", padding: "12px 14px", border: "1px solid #2874f0", borderRadius: 4, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box", boxShadow: "0 0 0 3px rgba(40,116,240,0.12)" }} />
                  ) : (
                    <p style={{ fontSize: 15, color: "#212121", fontWeight: 500, margin: 0 }}>{formData[key] || <span style={{ color: "#bbb" }}>Not provided</span>}</p>
                  )}
                </div>
              ))}

              {/* Member info */}
              <div style={{ background: "#f9f9f9", borderRadius: 8, padding: 16, marginTop: 8 }}>
                <p style={{ fontSize: 12, color: "#757575", marginBottom: 4 }}>🎯 Account Status</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#388e3c" }}>● Active Member</p>
                <p style={{ fontSize: 12, color: "#bbb", marginTop: 4 }}>Member since {new Date().getFullYear()}</p>
              </div>
            </div>
          </div>

          {/* Logout button (large red) */}
          <button onClick={() => setShowLogoutConfirm(true)}
            style={{
              marginTop: 16, width: "100%", padding: "14px", background: "#fff",
              border: "1px solid #f44336", color: "#f44336", borderRadius: 4,
              fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
              transition: "all 0.2s"
            }}
            onMouseEnter={e => { e.target.style.background = "#f44336"; e.target.style.color = "#fff"; }}
            onMouseLeave={e => { e.target.style.background = "#fff"; e.target.style.color = "#f44336"; }}>
            🚪 Logout from Ceekeey
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
