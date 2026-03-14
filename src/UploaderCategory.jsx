import { useState } from "react";
import HomeScreen from "./HomeScreen";

export default function UploaderCategory() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [img, setImg] = useState(null);
  const [preview, setPreview] = useState(null);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImg(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };
  
  const uploadData = () => {
    if (!name || !category || !img) {
      alert("Please provide name, category, and image!");
      return;
    }

    console.log("Uploading:", { name, category, img });

    const formData = new FormData();
    formData.append("name", name); // matches backend field
    formData.append("category", category);
    formData.append("image", img);

    fetch("http://localhost:8080/category", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.text())
      .then((data) => {
        alert("Upload successful!");
        console.log("Success:", data);
        setName("");       // ✅ clear all fields
        setCategory("");
        setImg(null);
        setPreview(null);
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Upload failed!");
      });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Category Upload</h1>
      <div style={styles.form}>
        {/* Name Input */}
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={styles.input}
        />

        {/* Category Input */}
        <input
          type="text"
          placeholder="Category Name"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={styles.input}
        />

        {/* Image Upload */}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={styles.inputFile}
        />

        {/* Preview */}
        {preview && (
          <img
            src={preview}
            alt="Preview"
            style={styles.previewImage}
          />
        )}

        {/* Upload Button */}
        <button onClick={uploadData} style={styles.button}>
          Upload
        </button>
      </div>
    </div>
  );
}

// Styles
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #fceabb, #f8b500)",
    fontFamily: "Arial, sans-serif",
    padding: "20px",
  },
  heading: {
    fontSize: "2.5rem",
    color: "#fff",
    marginBottom: "30px",
    textShadow: "2px 2px 8px rgba(0,0,0,0.4)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    background: "#fff",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    width: "100%",
    maxWidth: "400px",
  },
  input: {
    padding: "12px 15px",
    fontSize: "1rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
  },
  inputFile: {
    padding: "5px 0",
    fontSize: "1rem",
  },
  previewImage: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "10px",
    border: "1px solid #ccc",
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
    transition: "all 0.3s",
  },
};
