import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

function NavbarUser() {
    const { logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear localStorage and logout the user
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        logout();
    
        // Redirect to the login page and force a page reload
        window.location.href = '/';
    };

    const handleNavigation = (path) => {
        window.location.href = path; // Use window.location.href to force a page reload
    };

    return (
        <>
            <Navbar bg="dark" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand onClick={() => handleNavigation('/')} style={{cursor: 'pointer'}}>Travel</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link onClick={() => handleNavigation('/my-trips')}>My Trip</Nav.Link>
                        <Nav.Link onClick={() => handleNavigation('/favorite-packages')}>Favorite</Nav.Link>
                        <Nav.Link onClick={() => handleNavigation('/gallery')}>Gallery</Nav.Link>
                        <Nav.Link onClick={() => handleNavigation('/contact-us')}>Contact Us</Nav.Link>
                    </Nav>
                    <Dropdown align="end">
                        <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                            Profile
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleNavigation('/profile')}>My Profile</Dropdown.Item>
                            <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Container>
            </Navbar>
        </>
    );
}

export default NavbarUser;