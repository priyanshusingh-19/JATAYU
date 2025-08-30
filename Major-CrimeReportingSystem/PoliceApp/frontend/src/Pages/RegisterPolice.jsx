import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Spinner } from "react-bootstrap";
import AuthContext from "../context/authContext";

const RegisterPolice = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { registerPolice } = useContext(AuthContext);
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const navigate = useNavigate();
  const password = watch("password", "");

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");

    const policeData = {
      StationName: data.StationName,
      address: data.address,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      phone: data.phone,
      password: data.password,
    };

    const result = await registerPolice(policeData);

    if (result.success) {
      navigate("/");
    } else {
      setError(result.message || "Registration failed.");
    }

    setIsLoading(false);
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card shadow-lg p-4 m-5" style={{ width: "32rem" }}>
        <div className="card-body">
          <h2 className="text-center text-primary">Police Registration</h2>
          <p className="text-center text-muted">Register your police station</p>

          {error && <div className="alert alert-danger text-center">{error}</div>}

          <form onSubmit={handleSubmit(onSubmit)}>

            {/* Station Name */}
            <div className="mb-3">
              <label className="form-label">Station Name</label>
              <input
                type="text"
                className={`form-control ${errors.StationName ? "is-invalid" : ""}`}
                {...register("StationName", { required: "Station name is required" })}
              />
              {errors.StationName && <div className="invalid-feedback">{errors.StationName.message}</div>}
            </div>

            {/* Address */}
            <div className="mb-3">
              <label className="form-label">Address</label>
              <input
                type="text"
                className={`form-control ${errors.address ? "is-invalid" : ""}`}
                {...register("address", { required: "Address is required" })}
              />
              {errors.address && <div className="invalid-feedback">{errors.address.message}</div>}
            </div>

            {/* City */}
            <div className="mb-3">
              <label className="form-label">City</label>
              <input
                type="text"
                className={`form-control ${errors.city ? "is-invalid" : ""}`}
                {...register("city", { required: "City is required" })}
              />
              {errors.city && <div className="invalid-feedback">{errors.city.message}</div>}
            </div>

            {/* State */}
            <div className="mb-3">
              <label className="form-label">State</label>
              <input
                type="text"
                className={`form-control ${errors.state ? "is-invalid" : ""}`}
                {...register("state", { required: "State is required" })}
              />
              {errors.state && <div className="invalid-feedback">{errors.state.message}</div>}
            </div>

            {/* Pincode */}
            <div className="mb-3">
              <label className="form-label">Pincode</label>
              <input
                type="text"
                className={`form-control ${errors.pincode ? "is-invalid" : ""}`}
                {...register("pincode", {
                  required: "Pincode is required",
                  pattern: { value: /^[0-9]{6}$/, message: "Pincode must be 6 digits" }
                })}
              />
              {errors.pincode && <div className="invalid-feedback">{errors.pincode.message}</div>}
            </div>

            {/* Phone */}
            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: { value: /^[0-9]{10}$/, message: "Phone must be 10 digits" }
                })}
              />
              {errors.phone && <div className="invalid-feedback">{errors.phone.message}</div>}
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                type="password"
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" },
                  pattern: {
                    value: /^(?=.*[A-Z])(?=.*\d).{6,}$/,
                    message: "Must contain one uppercase and one number"
                  }
                })}
              />
              {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
            </div>

            {/* Confirm Password */}
            <div className="mb-3">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                {...register("confirmPassword", {
                  required: "Confirm your password",
                  validate: (value) => value === password || "Passwords do not match"
                })}
              />
              {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword.message}</div>}
            </div>

            {/* Submit Button */}
            <div className="d-grid">
              <button className="btn btn-primary" type="submit" disabled={isLoading}>
                {isLoading ? <><Spinner animation="border" size="sm" /> Creating...</> : "Register Station"}
              </button>
            </div>
          </form>

          <p className="text-center mt-3">
            Already registered?{" "}
            <Link to="/login" className="text-decoration-none text-primary">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPolice;
