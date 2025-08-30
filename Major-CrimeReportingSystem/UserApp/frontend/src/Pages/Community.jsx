import { useState } from "react";
import axios from "axios";

function Community() {
  const [input, setInput] = useState({
    name: "",
    phone: "",
    email: "",
    location: ""
  });

  function inptChange(event) {
    const { name, value } = event.target;
    setInput((prevInput) => ({
      ...prevInput,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const result = await axios.post(
        "http://localhost:5000/api/join",
        input,
        { withCredentials: true }
      );
      alert(result.data.message);
      setInput({
        name: "",
        phone: "",
        email: "",
        location: ""
      });
    } catch (error) {
      alert(
        error.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    }
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-sm-10">
          <div className="card shadow p-4">
            <h3 className="text-center mb-4">Join the Community</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  value={input.name}
                  onChange={inptChange}
                  className="form-control"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={input.email}
                  onChange={inptChange}
                  className="form-control"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="phone" className="form-label">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={input.phone}
                  onChange={inptChange}
                  className="form-control"
                  placeholder="Enter your phone number"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="location" className="form-label">Location</label>
                <input
                  type="text"
                  name="location"
                  value={input.location}
                  onChange={inptChange}
                  className="form-control"
                  placeholder="Enter your address"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Join Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Community;
