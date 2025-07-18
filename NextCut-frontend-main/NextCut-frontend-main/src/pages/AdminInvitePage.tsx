import React, { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const AdminInvitePage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [shopName, setShopName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/admin/send-barber-invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, shopName }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Invite sent successfully!");
        setEmail("");
        setShopName("");
      } else {
        setError(data.error || "Failed to send invite");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Send Barber Registration Invite</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Barber's Email</label>
            <input
              type="email"
              className="input-field w-full"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="barber@example.com"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Shop Name (optional)</label>
            <input
              type="text"
              className="input-field w-full"
              value={shopName}
              onChange={e => setShopName(e.target.value)}
              placeholder="Barber Shop Name"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="btn-primary w-full h-12 flex items-center justify-center"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Invite"}
          </button>
        </form>
        {message && <div className="mt-4 text-green-600 text-center">{message}</div>}
        {error && <div className="mt-4 text-red-600 text-center">{error}</div>}
      </div>
    </div>
  );
};

export default AdminInvitePage; 