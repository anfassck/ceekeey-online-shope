import { useState, useEffect } from "react";
import "./admin.css";

const BASE = "http://localhost:8080";

export default function AdminCustomers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${BASE}/users`);
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <div className="admin-loading">Loading customers...</div>;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h2>Customers List</h2>
          <p>View all registered users and their details</p>
        </div>
      </div>

      <div className="admin-card table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Profile</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Password</th>
              <th>Status</th>
              <th>Joined Date</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  {user.profileImage ? (
                    <img 
                      src={user.profileImage.startsWith("http") ? user.profileImage : `${BASE}${user.profileImage}`} 
                      alt="dp" 
                      style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} 
                    />
                  ) : (
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#e0e0e0", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", color: "#757575" }}>
                      {user.fullname ? user.fullname[0].toUpperCase() : "?"}
                    </div>
                  )}
                </td>
                <td style={{ fontWeight: 600 }}>{user.fullname}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>
                  <span style={{ fontFamily: "monospace", padding: "4px 8px", background: "#f5f5f5", borderRadius: "4px" }}>
                    {user.password || "N/A"}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${user.status === 'online' ? 'status-active' : 'status-inactive'}`}>
                    {user.status || "offline"}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "30px", color: "#878787" }}>
                  No registered users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
