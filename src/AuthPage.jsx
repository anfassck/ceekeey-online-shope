import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ceekeey.css";

const BASE = "http://localhost:8080";

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/";
  const productForBuy = location.state?.product;

  const [tab, setTab] = useState(location.state?.tab || "login");
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({ fullname: "", phone: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [authMode, setAuthMode] = useState("password"); // "password", "otp_request", "otp_verify"
  const [mobileNum, setMobileNum] = useState("");
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const requestOtp = (e) => {
    e.preventDefault();
    if (!mobileNum || mobileNum.length < 10) {
      setError("Please enter a valid mobile number.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAuthMode("otp_verify");
      setTimer(30);
      alert("Test OTP: 1234");
    }, 1000);
  };

  const verifyOtp = (e) => {
    e.preventDefault();
    if (otp === "1234") {
      // Mock login using OTP
      localStorage.setItem("user", JSON.stringify({ fullname: "OTP User", phone: mobileNum, email: "otpuser@dummy.com", status: "online" }));
      if (productForBuy) {
        navigate("/address", { state: { product: productForBuy } });
      } else {
        navigate(redirectTo);
      }
      setTimeout(() => window.location.reload(), 200);
    } else {
      setError("Invalid OTP entered.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const res = await fetch(`${BASE}/login`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      setLoading(false);
      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        if (productForBuy) {
          navigate("/address", { state: { product: productForBuy } });
        } else {
          navigate(redirectTo);
        }
        window.location.reload();
      } else { setError(data.message || "Invalid email or password."); }
    } catch { setLoading(false); setError("Cannot connect to server."); }
  };

  const handleSignup = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const res = await fetch(`${BASE}/signup`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupForm),
      });
      const data = await res.json();
      setLoading(false);
      if (res.ok) {
        setTab("login");
        setLoginForm({ email: signupForm.email, password: "" });
        setError("");
        alert("✅ Account created! Please login.");
      } else { setError(data.message || "Signup failed."); }
    } catch { setLoading(false); setError("Server error."); }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #2874f0 0%, #1a5ecf 40%, #0d3a8a 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
      fontFamily: "'Inter', 'Roboto', sans-serif"
    }}>
      {/* Back to store */}
      <button
        onClick={() => navigate("/")}
        style={{
          position: "fixed", top: 20, left: 20, background: "rgba(255,255,255,0.15)",
          border: "1px solid rgba(255,255,255,0.3)", color: "#fff", padding: "8px 18px",
          borderRadius: 6, cursor: "pointer", fontSize: 13, font: "inherit",
          backdropFilter: "blur(8px)", zIndex: 100,
        }}
      >
        ← Back to Ceekeey
      </button>

      <div style={{
        background: "#fff", borderRadius: 16, overflow: "hidden",
        display: "flex", width: 860, maxWidth: "96vw",
        boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
        animation: "modalPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
        opacity: 0,
        transform: "scale(0.95)"
      }}>
        {/* ── Left Panel ── */}
        <div style={{
          background: "linear-gradient(160deg, #2874f0 0%, #1a5ecf 60%, #0d3a8a 100%)",
          width: 320, flexShrink: 0, padding: 48, display: "flex",
          flexDirection: "column", justifyContent: "space-between"
        }}>
          <div>
            <div style={{ fontSize: 30, fontWeight: 900, fontStyle: "italic", color: "#fff", marginBottom: 8 }}>Ceekeey</div>
            <p style={{ fontSize: 12, color: "#c9d8ff", marginBottom: 40 }}>Explore Plus ⭐</p>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: "#fff", lineHeight: 1.3, marginBottom: 16 }}>
              {tab === "login" ? "Login" : "Looks like you're new here!"}
            </h2>
            <p style={{ fontSize: 14, color: "#c9d8ff", lineHeight: 1.7 }}>
              {tab === "login"
                ? "Get access to your Orders, Wishlist and exclusive member deals."
                : "Sign up with your mobile number to get started on Ceekeey"}
            </p>
          </div>
          <div style={{ textAlign: "center", fontSize: 100, lineHeight: 1 }}>
            {tab === "login" ? "🛍️" : "🎉"}
          </div>
        </div>

        {/* ── Right Panel ── */}
        <div style={{ flex: 1, padding: "48px 40px", overflowY: "auto" }}>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 0, marginBottom: 32, borderBottom: "2px solid #f0f0f0" }}>
            {["login", "signup"].map((t) => (
              <button key={t} onClick={() => { setTab(t); setError(""); }}
                style={{
                  flex: 1, padding: "12px 0", border: "none", cursor: "pointer",
                  background: "none", fontSize: 15, fontWeight: 700, fontFamily: "inherit",
                  color: tab === t ? "#2874f0" : "#878787",
                  borderBottom: tab === t ? "3px solid #2874f0" : "3px solid transparent",
                  marginBottom: -2, transition: "all 0.2s",
                  textTransform: "capitalize",
                }}>
                {t === "login" ? "Login" : "Create Account"}
              </button>
            ))}
          </div>

          {tab === "login" ? (
            authMode === "password" ? (
              <form onSubmit={handleLogin}>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#212121", marginBottom: 24 }}>Enter your login details</p>
                <div style={{ marginBottom: 18 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#757575", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Email Address</label>
                  <input type="email" placeholder="youremail@example.com" required
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    style={inputStyle} onFocus={(e) => Object.assign(e.target.style, inputFocus)} onBlur={(e) => Object.assign(e.target.style, inputStyle)} />
                </div>
                <div style={{ marginBottom: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#757575", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Password</label>
                    <span onClick={() => { setAuthMode("otp_request"); setError(""); }} style={{ fontSize: 12, color: "#2874f0", cursor: "pointer", fontWeight: 600 }}>Forgot Password?</span>
                  </div>
                  <input type="password" placeholder="Enter password" required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    style={inputStyle} onFocus={(e) => Object.assign(e.target.style, inputFocus)} onBlur={(e) => Object.assign(e.target.style, inputStyle)} />
                </div>
                {error && <p style={{ color: "#d32f2f", fontSize: 13, marginBottom: 12 }}>⚠️ {error}</p>}
                
                <button type="submit" disabled={loading} style={{ ...submitBtn, marginBottom: 12 }}>
                  {loading ? "Logging in..." : "Login Securely →"}
                </button>

                <p style={{ textAlign: "center", fontSize: 13, color: "#878787", margin: "16px 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ height: 1, background: "#e0e0e0", flex: 1 }}></span>
                  <span style={{ margin: "0 10px" }}>OR</span>
                  <span style={{ height: 1, background: "#e0e0e0", flex: 1 }}></span>
                </p>

                <button type="button" onClick={() => { setAuthMode("otp_request"); setError(""); }} style={{ ...submitBtn, background: "#fff", color: "#2874f0", border: "1px solid #2874f0" }}>
                  Login with Mobile OTP
                </button>

                <p style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: "#878787" }}>
                  New to Ceekeey?{" "}
                  <span onClick={() => { setTab("signup"); setAuthMode("password"); setError(""); }} style={{ color: "#2874f0", fontWeight: 700, cursor: "pointer" }}>Create account →</span>
                </p>
              </form>
            ) : authMode === "otp_request" ? (
               <form onSubmit={requestOtp}>
                 <p style={{ fontSize: 16, fontWeight: 700, color: "#212121", marginBottom: 24 }}>Login or Reset Password with OTP</p>
                 <div style={{ marginBottom: 18 }}>
                   <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#757575", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Mobile Number</label>
                   <input type="tel" placeholder="Enter 10 digit mobile number" required
                     value={mobileNum}
                     onChange={(e) => setMobileNum(e.target.value)}
                     style={inputStyle} onFocus={(e) => Object.assign(e.target.style, inputFocus)} onBlur={(e) => Object.assign(e.target.style, inputStyle)} />
                 </div>
                 {error && <p style={{ color: "#d32f2f", fontSize: 13, marginBottom: 12 }}>⚠️ {error}</p>}
                 <button type="submit" disabled={loading} style={submitBtn}>
                   {loading ? "Sending..." : "Request OTP"}
                 </button>
                 <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#878787" }}>
                   <span onClick={() => { setAuthMode("password"); setError(""); }} style={{ color: "#2874f0", fontWeight: 700, cursor: "pointer" }}>← Back to Email Login</span>
                 </p>
               </form>
            ) : (
               <form onSubmit={verifyOtp}>
                 <p style={{ fontSize: 16, fontWeight: 700, color: "#212121", marginBottom: 8 }}>Verify Mobile Number</p>
                 <p style={{ fontSize: 13, color: "#757575", marginBottom: 24 }}>An OTP has been sent to {mobileNum}.</p>
                 <div style={{ marginBottom: 18 }}>
                   <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#757575", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>Enter OTP</label>
                   <input type="text" placeholder="Enter 4-digit OTP (hint: 1234)" required
                     value={otp}
                     onChange={(e) => setOtp(e.target.value)}
                     style={inputStyle} onFocus={(e) => Object.assign(e.target.style, inputFocus)} onBlur={(e) => Object.assign(e.target.style, inputStyle)} />
                 </div>
                 {error && <p style={{ color: "#d32f2f", fontSize: 13, marginBottom: 12 }}>⚠️ {error}</p>}
                 
                 <button type="submit" disabled={loading} style={submitBtn}>
                   Verify & Login
                 </button>
                 <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#878787" }}>
                   {timer > 0 ? (
                      `Resend OTP in ${timer}s`
                   ) : (
                      <span onClick={requestOtp} style={{ color: "#2874f0", fontWeight: 700, cursor: "pointer" }}>Resend OTP</span>
                   )}
                 </p>
                 <p style={{ textAlign: "center", marginTop: 12, fontSize: 13, color: "#878787" }}>
                   <span onClick={() => { setAuthMode("otp_request"); setError(""); setOtp(""); }} style={{ color: "#2874f0", fontWeight: 700, cursor: "pointer" }}>← Change Number</span>
                 </p>
               </form>
            )
          ) : (
            <form onSubmit={handleSignup}>
              <p style={{ fontSize: 16, fontWeight: 700, color: "#212121", marginBottom: 24 }}>Enter your details to get started</p>
              {[
                { label: "Full Name", type: "text", field: "fullname", placeholder: "Your full name" },
                { label: "Mobile Number", type: "tel", field: "phone", placeholder: "+91 XXXXX XXXXX" },
                { label: "Email Address", type: "email", field: "email", placeholder: "youremail@example.com" },
                { label: "Create Password", type: "password", field: "password", placeholder: "Min 6 characters" },
              ].map(({ label, type, field, placeholder }) => (
                <div key={field} style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#757575", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>
                  <input type={type} placeholder={placeholder} required
                    value={signupForm[field]}
                    onChange={(e) => setSignupForm({ ...signupForm, [field]: e.target.value })}
                    style={inputStyle} onFocus={(e) => Object.assign(e.target.style, inputFocus)} onBlur={(e) => Object.assign(e.target.style, inputStyle)} />
                </div>
              ))}
              {error && <p style={{ color: "#d32f2f", fontSize: 13, marginBottom: 12 }}>⚠️ {error}</p>}
              <button type="submit" disabled={loading} style={{ ...submitBtn, background: "#fb641b" }}>
                {loading ? "Creating..." : "Create Account →"}
              </button>
              <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "#878787" }}>
                Already registered?{" "}
                <span onClick={() => { setTab("login"); setError(""); }} style={{ color: "#2874f0", fontWeight: 700, cursor: "pointer" }}>Login here →</span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "13px 14px", border: "1px solid #e0e0e0",
  borderRadius: 6, fontSize: 14, fontFamily: "inherit",
  outline: "none", transition: "border 0.2s, box-shadow 0.2s", boxSizing: "border-box",
};
const inputFocus = { border: "1px solid #2874f0", boxShadow: "0 0 0 3px rgba(40,116,240,0.12)" };
const submitBtn = {
  width: "100%", padding: "14px", background: "#2874f0", color: "#fff",
  border: "none", borderRadius: 6, fontSize: 15, fontWeight: 700, cursor: "pointer",
  fontFamily: "inherit", transition: "background 0.2s", letterSpacing: "0.02em",
};
