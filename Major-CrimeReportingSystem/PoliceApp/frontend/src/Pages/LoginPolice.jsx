import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Container, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import AuthContext from "../context/authContext";

const PoliceLogin = () => {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { loginPolice } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    setIsLoading(true);
    setError("");

    const result = await loginPolice(formData.StationName, formData.password);

    if (result.success) {
        navigate("/");
    } else {
      setError(result.message || "Login failed. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Card className="shadow-lg border-0 p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <Card.Body>
          <h2 className="text-center text-primary fw-bold">Sign In</h2>
          <p className="text-muted text-center">Access your account</p>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit(onSubmit)} className="mt-4">
            {/* stationName Field */}
           <Form.Group controlId="StationName" className="mb-3">
                <Form.Label>Station Name</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter your station name"
                    {...register("StationName", {
                    required: "Station name is required",
                    minLength: {
                        value: 3,
                        message: "Station name must be at least 3 characters",
                    },
                    })}
                    isInvalid={!!errors.stationName}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.stationName?.message}
                </Form.Control.Feedback>
            </Form.Group>


            {/* Password Field */}
            <Form.Group controlId="password" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                {...register("password", { required: "Password is required" })}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password?.message}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Submit Button */}
            <Button type="submit" variant="primary" className="w-100" disabled={isLoading}>
              {isLoading ? <Spinner animation="border" size="sm" /> : "Sign In"}
            </Button>
          </Form>

          {/* Register Link */}
          <div className="text-center mt-3">
            <p className="text-muted">
              Don't have an account?{" "}
              <Link to="/register" className="text-decoration-none text-primary fw-bold">
                Sign up
              </Link>
            </p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PoliceLogin;
