import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import AuthContext from "./context/authContext";
const NavigationBar = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const { police } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout(navigate);
  };

  return (
    <Navbar
      variant="dark"
      expand="lg"
      sticky="top"
      className="shadow-lg px-3"
      style={{ height: "5rem", backgroundColor: "#212529" }}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold d-flex align-items-center">
          <img
            width="50"
            height="50"
            className="me-2 rounded-circle border border-light p-1"
            src="/assets/logo.png"
            alt="Logo"
          />
          <span className="fs-4 text-light fw-bold">JATAYU</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0" />
        <Navbar.Collapse id="basic-navbar-nav" style={{ backgroundColor: "#212529" }}>
          <Nav className="ms-auto text-uppercase">
            <Nav.Link as={Link} to="/" className="fw-semibold text-light px-3">Home</Nav.Link>

            {police ? (
              <>
                <Nav.Link as={Link} to="/report/police" className="fw-semibold text-light px-3">Reports</Nav.Link>
                <Nav.Link as={Link} to="/alert/send" className="fw-semibold text-light px-3">Alert</Nav.Link>

                <NavDropdown title={<span className="text-light">{`Hello, ${police.StationName}`}</span>} id="police-nav-dropdown">
                  <NavDropdown.Item as={Link} to="/profile/police">Profile</NavDropdown.Item>
                  <NavDropdown.Item onClick={handleLogout} className="text-danger">Logout</NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="fw-semibold text-light px-3">Login</Nav.Link>
                <Nav.Link as={Link} to="/register" className="fw-semibold text-light px-3">Register</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
