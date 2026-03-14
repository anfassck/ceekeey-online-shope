import { useState, useEffect } from "react";

export default function UploadScreen() {
  const [name, setName] = useState("");
  const [img, setImg] = useState(null);
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState(null);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/category"
        );
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to load categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImg(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const uploadData = async () => {
    if (!name || !img || !category) {
      alert("Please provide name, category, and image!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("file", img);
    formData.append("category", category);
    if (price) formData.append("price", price);
    if (description) formData.append("description", description);

    try {
      await fetch("http://localhost:8080/product", {
        method: "POST",
        body: formData,
      });

      alert("✅ Upload successful!");

      setName("");
      setCategory("");
      setPrice("");
      setDescription("");
      setImg(null);
      setPreview(null);
    } catch (error) {
      console.error("Upload Error:", error);
      alert("❌ Upload failed!");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Category / Product Upload</h1>

      <div style={styles.form}>
        <input
          type="text"
          placeholder="Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={styles.input}
        >
          <option value="">Select Category</option>
          {categories.map((cat, index) => (
            <option key={index} value={cat._id || cat}>
              {cat.name || cat}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Price (optional)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={styles.input}
        />

        <textarea
          placeholder="Product Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={styles.textarea}
        />

        <input
          type="file"
          onChange={handleImageChange}
          style={styles.inputFile}
          accept="image/*"
        />

        <button onClick={uploadData} style={styles.button}>
          Upload
        </button>

        {/* 📱 BIG MOBILE PREVIEW */}
        {preview && (
          <div style={styles.previewWrapper}>
            <img src={preview} alt="Preview" style={styles.previewImage} />
          </div>
        )}
      </div>
    </div>
  );
}

/* 🎨 Styles */
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #fceabb, #f8b500)",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },

  heading: {
    fontSize: "2.3rem",
    color: "#fff",
    marginBottom: "25px",
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
  },

  textarea: {
    padding: "12px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    resize: "vertical",
    minHeight: "80px",
  },

  inputFile: {
    fontSize: "1rem",
  },

  /* 📱 Mobile-sized preview */
  previewWrapper: {
    width: "360px",
    height: "640px",
    margin: "10px auto 0",
    borderRadius: "20px",
    overflow: "hidden",
    border: "2px solid #ddd",
    background: "#000",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  previewImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
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
  },
};
