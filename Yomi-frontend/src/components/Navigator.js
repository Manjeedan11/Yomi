import Cookies from 'js-cookie';
import React from 'react';
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';

function Navigator() {

  const logout = async () => {

    try {
      const response = await fetch('http://localhost:5000/api/user/logout', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.error('Failed to logout');
        return;
      }
      const data = await response.json();
      Cookies.remove("username");
      window.location.href = '/login';
      console.log(data);
    } catch (error) {
      console.error('Fetch error:', error);
    }

  }


  return (
    <Navbar expand="lg" className="bg-background  w-full flex-row fixed top-0">
      <Container >
        <Navbar.Brand href="/"><h1>Yomi</h1></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-between">
          <Nav>
            <Nav.Link href="/catalog" className="text-highlight hover:text-white">Find Manga</Nav.Link>
            <Nav.Link href="/collection" className="text-highlight hover:text-white">My Collection</Nav.Link>
          </Nav>

          {!Cookies.get("username") ? (
            <NavDropdown title="Account" id="basic-nav-dropdown" menuVariant="dark" className="text-highlight hover:text-white bg-background">

              <NavDropdown.Item href="/login">Login</NavDropdown.Item>
              <NavDropdown.Item href="/register">Register</NavDropdown.Item>
            </NavDropdown>) : (
            <Nav.Link onClick={logout} className="text-highlight hover:text-white">logout</Nav.Link>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigator;
