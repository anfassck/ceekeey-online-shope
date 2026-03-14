import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Confetti from "react-confetti"; // npm install react-confetti

const SuccessPage = () => {
  const navigate = useNavigate();
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Update dimensions on window resize for confetti
  useEffect(() => {
    const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleBackHome = () => {
    navigate("/");
  };

  return (
    <div style={styles.container}>
      {/* Confetti Animation */}
      <Confetti width={dimensions.width} height={dimensions.height} numberOfPieces={300} recycle={false} />

      <h1 style={styles.heading}>✅ Order Placed Successfully</h1>
      <p style={styles.subText}>Thank you for shopping with us!</p>

      <button style={styles.btn} onClick={handleBackHome}>
        Back to Home
      </button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: 80,
    padding: 20,
    minHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f1f3f6",
  },
  heading: {
    fontSize: "2.5rem",
    color: "#2874f0",
    marginBottom: 20,
  },
  subText: {
    fontSize: "1.2rem",
    color: "#555",
    marginBottom: 40,
  },
  btn: {
    padding: "15px 50px",
    fontSize: "1.1rem",
    fontWeight: "600",
    background: "linear-gradient(90deg, #ffcc00 0%, #fb641b 100%)",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
  },
};

export default SuccessPage;
