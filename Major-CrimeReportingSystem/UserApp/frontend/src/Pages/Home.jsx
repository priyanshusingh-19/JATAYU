import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Button, Card } from "react-bootstrap";

const handleSOS = () => {
  navigator.geolocation.getCurrentPosition(position => {
    const { longitude, latitude } = position.coords;

    fetch("http://localhost:5000/api/sos/alert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ lng: longitude , lat: latitude})
    })
      .then(res => res.json())
      .then(data => {
        alert(`${data.notified} community members alerted via SMS`);
      });
  });
};


const Home = () => {
  return (
    <div className="container">
      <section className="bg-black text-white py-5 text-center">
        <Container>
          <h1 className="display-4 fw-bold">Report Crime. Stay Safe.</h1>
          <p className="lead">
            Be someone's JATAYU , and there will be JATAYU for you.
          </p>
          <button
        onClick={handleSOS}
          className="btn btn-danger p-3 rounded mt-5"
        >
          <i className="fa-solid fa-bell"></i><br /> Emergency SOS
        </button>

<div className="text-center my-5">
  <a href="/join/user" className="btn btn-primary fw-bold px-4 py-2 rounded-pill shadow-sm">
    Join as Community Member
  </a>
</div>

          <div className="mt-4 d-flex flex-column flex-md-row justify-content-center align-items-center">
            
            <Button as={Link} to="/report/user" variant="warning" size="lg" className="me-md-3 mb-3 mb-md-0">
              Report an Incident
            </Button>
            <Button as={Link} to="/alert/user" variant="danger" size="lg" className="me-md-3 mb-3 mb-md-0">
              Nearest Alerts
            </Button>
            <Button as={Link} to="/map/user" variant="info" size="lg" className="me-md-3 mb-3 mb-md-0">
              Locate Services
            </Button>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <Container>
          <div className="text-center">
            <h2 className="fw-bold">Features</h2>
            <p className="text-muted">
              Our platform provides comprehensive tools to ensure your safety and quick response.
            </p>
          </div>

          <Row className="mt-4">
            {[ 
              { title: "Real-time Reporting", text: "Report incidents in real-time with photo and video evidence." },
              { title: "Location Tracking", text: "Find nearest police stations and get directions." },
              { title: "Safety Alerts", text: "Receive real-time alerts about incidents in your area." },
              { title: "Live Streaming", text: "Stream video to emergency services during critical situations." },
              { title: "Safety Guide", text: "Access comprehensive safety tips and guides." },
              { title: "Emergency Directory", text: "Quick access to emergency services contact information." },
            ].map((feature, index) => (
              <Col md={4} className="mb-4" key={index}>
                <Card className="h-100 shadow">
                  <Card.Body>
                    <h5 className="fw-bold">{feature.title}</h5>
                    <p className="text-muted">{feature.text}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      <section className="bg-dark text-white py-5">
        <Container className="text-center">
          <div className="mt-3">
            Jatayu is a platform that allows you to report incidents in real-time and receive immediate help.
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Home;
