import { useState } from "react";

export default function UploadeSlider() {
  const [name, setName] = useState("");
  const [img, setImg] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImg(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const uploadData = async () => {
    if (!name || !img) {
      alert("Please provide both name and image!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("image", img);

      const res = await fetch(
        "http://localhost:8080/slideimage",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Upload failed");

      await res.text();
      alert("✅ Upload successful!");

      setName("");
      setImg(null);
      setPreview(null);
    } catch (err) {
      console.error("Error uploading image:", err);
      alert("❌ Upload failed. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Upload Slider Image</h1>

      <div style={styles.form}>
        {/* Image name */}
        <input
          type="text"
          placeholder="Enter image title"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />

        {/* Image upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={styles.inputFile}
        />

        {/* Mobile preview */}
        {preview && (
          <div style={styles.previewWrapper}>
            <img src={preview} alt="Preview" style={styles.previewImage} />
          </div>
        )}

        {/* Upload button */}
        <button onClick={uploadData} style={styles.button}>
          Upload
        </button>
      </div>
    </div>
  );
}

/* 🎨 Styles */
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #fceabb, #f8b500)",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },

  heading: {
    position: "absolute",
    top: "30px",
    fontSize: "2.2rem",
    color: "#fff",
    textShadow: "2px 2px 8px rgba(0,0,0,0.4)",
  },

  form: {
    background: "#fff",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.25)",
    width: "100%",
    maxWidth: "420px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  input: {
    padding: "12px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
  },

  inputFile: {
    fontSize: "1rem",
  },

  /* 📱 Mobile slider preview */
  previewWrapper: {
    width: "360px",     // mobile width
    height: "640px",    // mobile height (9:16)
    margin: "0 auto",
    borderRadius: "20px",
    overflow: "hidden",
    border: "2px solid #ddd",
    backgroundColor: "#000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  previewImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover", // IMPORTANT for slider images
  },

  button: {
    padding: "12px",
    fontSize: "1.1rem",
    fontWeight: "600",
    backgroundColor: "#ff4c3b",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "0.3s",
  },
};
