import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import "bootstrap/dist/css/bootstrap.min.css";
import AuthContext from "../context/authContext";

const accessToken = import.meta.env.VITE_MAP_TOKEN;

const ReportForm = () => {
  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useCurrentLocation, setUseCurrentLocation] = useState(true);

  const navigate = useNavigate();
  const { user, updateUserPoints } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const createReportMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await fetch("http://localhost:5000/api/reports", {
        method: "POST",
        body: formData,
        credentials: "include"
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit report");
      }

      return await response.json();
    },
    onSuccess: async () => {
      if (user) {
        await updateUserPoints(user._id, 100);
      }
      reset();
      setFiles([]);
      setPreviewUrls([]);
      setLocation(null);
      setAddress("");
      setSubmitError("");
      navigate("/dashboard/user", {
        state: { success: true, message: "Report submitted successfully" }
      });
    },
    onError: (error) => {
      setSubmitError(error.message || "Failed to submit report");
      setIsSubmitting(false);
    }
  });

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    const newPreviewUrls = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );
    setPreviewUrls(newPreviewUrls);
  };

  useEffect(() => {
    if (useCurrentLocation && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latlng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setLocation(latlng);
          try {
            const response = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${latlng.lng},${latlng.lat}.json?access_token=${accessToken}`
            );
            const data = await response.json();
            setAddress(data?.features?.[0]?.place_name || "Unknown location");
          } catch (error) {
            setAddress("Unable to determine address: " + error.message);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          setUseCurrentLocation(false);
        }
      );
    }
  }, [useCurrentLocation]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError("");

    let latitude = null;
    let longitude = null;
    let finalAddress = "";

    if (useCurrentLocation) {
      latitude = location?.lat;
      longitude = location?.lng;
      finalAddress = address;
    } else {
      finalAddress = data.manualAddress;
      try {
        const geocodeResponse = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            finalAddress
          )}.json?access_token=${accessToken}`
        );
        const geocodeData = await geocodeResponse.json();
        const coords = geocodeData.features?.[0]?.center;
        if (!coords) throw new Error("Invalid manual address.");
        longitude = coords[0];
        latitude = coords[1];
      } catch (err) {
        setSubmitError("Manual address geocoding failed: " + err.message);
        setIsSubmitting(false);
        return;
      }
    }

    if (!latitude || !longitude || !finalAddress) {
      setSubmitError("Please provide a valid location");
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("incidentType", data.incidentType);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("address", finalAddress);
    files.forEach((file) => formData.append("media", file));

    createReportMutation.mutate(formData);
  };

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Report an Incident</h1>
      {submitError && <div className="alert alert-danger">{submitError}</div>}
      <form onSubmit={handleSubmit(onSubmit)} className="card p-4 shadow-sm">
        {/* Title */}
        <div className="mb-3">
          <label className="form-label">Incident Title</label>
          <input
            type="text"
            className="form-control"
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && (
            <div className="text-danger">{errors.title.message}</div>
          )}
        </div>

        {/* Incident Type */}
        <div className="mb-3">
          <label className="form-label">Incident Type</label>
          <select
            className="form-select"
            {...register("incidentType", { required: "Incident type is required" })}
          >
            <option value="">Select incident type</option>
            <option value="theft">Theft</option>
            <option value="assault">Assault</option>
            <option value="burglary">Burglary</option>
            <option value="vandalism">Vandalism</option>
            <option value="fraud">Fraud</option>
            <option value="harassment">Harassment</option>
            <option value="violent">Violent</option>
            <option value="traffic offense">Traffic offense</option>
            <option value="suspicious">Suspicious Activity</option>
            <option value="other">Other</option>
          </select>
          {errors.incidentType && (
            <div className="text-danger">{errors.incidentType.message}</div>
          )}
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows="4"
            {...register("description", { required: "Description is required" })}
          ></textarea>
          {errors.description && (
            <div className="text-danger">{errors.description.message}</div>
          )}
        </div>

        {/* Media Upload */}
        <div className="mb-3">
          <label className="form-label">Upload Media (Image/Video)</label>
          <input
            type="file"
            className="form-control"
            accept="image/*,video/*"
            multiple
            onChange={handleFileChange}
          />
          <div className="mt-2">
            {previewUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt="Preview"
                className="img-thumbnail me-2 mb-2"
                style={{ maxWidth: "150px" }}
              />
            ))}
          </div>
        </div>

        {/* Location Switch */}
        <div className="mb-3 form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            checked={useCurrentLocation}
            onChange={() => setUseCurrentLocation(!useCurrentLocation)}
          />
          <label className="form-check-label">Use Current Location</label>
        </div>

        {/* Location Input */}
        {useCurrentLocation ? (
          <div className="mb-3">
            <label className="form-label">Detected Location</label>
            <p>{address || "Fetching current location..."}</p>
          </div>
        ) : (
          <div className="mb-3">
            <label className="form-label">Manual Address</label>
            <input
              type="text"
              className="form-control"
              {...register("manualAddress", {
                required: "Manual address is required"
              })}
            />
            {errors.manualAddress && (
              <div className="text-danger">{errors.manualAddress.message}</div>
            )}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  );
};

export default ReportForm;
