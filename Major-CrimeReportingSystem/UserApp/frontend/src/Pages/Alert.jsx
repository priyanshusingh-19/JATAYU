import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
// import axios from "axios";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAP_TOKEN;

const socket = io("http://localhost:5000");

function Alert() {
  const [alerts, setAlerts] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const mapContainer = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const coords = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };
      setUserLocation(coords);

      socket.emit("register-location", coords);

      mapRef.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [coords.lng, coords.lat],
        zoom: 13,
      });

      new mapboxgl.Marker({ color: "blue" })
        .setLngLat([coords.lng, coords.lat])
        .setPopup(new mapboxgl.Popup().setText("You are here"))
        .addTo(mapRef.current);

      // axios.get("http://localhost:5000/api/alerts", {
      //     params: { lat: coords.lat, lng: coords.lng, radius: 5 },
      //   })
      //   .then((res) => {
      //     setAlerts(res.data);
      //     addAlertMarkers(res.data);
      //   })
      //   .catch((err) => console.error("Error fetching alerts:", err));
    });
  }, []);

  function addAlertMarkers(alertList) {
    if (!mapRef.current) return;
    alertList.forEach((alert) => {
      if (alert.location?.lat && alert.location?.lng) {
        new mapboxgl.Marker({ color: "red" })
          .setLngLat([alert.location.lng, alert.location.lat])
          .setPopup(
            new mapboxgl.Popup().setHTML(
              `<strong>${alert.message}</strong><br>${new Date(
                alert.timestamp
              ).toLocaleString()}`
            )
          )
          .addTo(mapRef.current);
      }
    });
  }

  useEffect(() => {
    socket.on("new-alert", (alert) => {
      console.log("New alert:", alert);
      setAlerts((prev) => [alert, ...prev]);
      addAlertMarkers([alert]); 
    });

    return () => {
      socket.off("new-alert");
    };
  }, []);

  return (
    <>
    <div className="col-10 offset-1 mt-4 d-flex justify-content-center mb-5">
      <div>
        <h3 className="text-center mb-3">Nearby Alerts</h3>
        <div
          ref={mapContainer}
          className="map-container"
          style={{ height: "500px", width: "800px" }}
        />
      </div>
    </div>
    <div className="col-10 offset-1 mt-4 d-flex justify-content-center mb-5">
      {alerts.length === 0 && <p><b>No alerts near you</b></p>}
      <ul>
        {alerts.map((a, idx) => (
         <li key={idx}>
            <p>Location - {a.locationName}</p>
            {a.message} — {" "}
            {a.timestamp ? new Date(a.timestamp).toLocaleString() : ""}
          </li>
        ))}
      </ul>
    </div>
    </>
  );
}

export default Alert;