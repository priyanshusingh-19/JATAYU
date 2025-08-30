import { useState } from "react";
import axios from "axios";

export default function AlertSend() {
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);

  const sendAlert = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post("http://localhost:5001/api/trigger-alert", {
        location,
        message
      });

      alert("Alert sent successfully!");
      setMessage("");
      setLocation("");
    } catch (err) {
      console.error(err);
      alert("Failed to send alert");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-sm-10">
          <div className="card shadow border-0">
            <div className="card-header bg-primary text-white text-center py-3">
              <h4 className="mb-0">
                <i className="bi bi-broadcast-pin me-2"></i>
                Send Alert
              </h4>
            </div>
            <div className="card-body p-4">
              <form onSubmit={sendAlert}>
                <div className="mb-3">
                  <label htmlFor="loc" className="form-label fw-semibold">
                    <i className="bi bi-geo-alt-fill me-1 text-primary"></i>
                    Location
                  </label>
                  <input
                    type="text"
                    name="loc"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="form-control"
                    placeholder="Enter alert location"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="msg" className="form-label fw-semibold">
                    <i className="bi bi-chat-left-text-fill me-1 text-primary"></i>
                    Message
                  </label>
                  <textarea
                    name="msg"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="form-control"
                    placeholder="Enter your message"
                    rows="3"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : (
                    <i className="bi bi-megaphone-fill me-2"></i>
                  )}
                  {loading ? "Sending..." : "Send Alert"}
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
