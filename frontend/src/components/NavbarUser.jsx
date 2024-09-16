import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

function NavbarUser() {
    const { logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear localStorage and logout the user
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        logout();
    
        // Redirect to the login page
        navigate('/');
    };

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <>
            <Navbar bg="dark" data-bs-theme="dark">
                <Container>
                    <Navbar.Brand onClick={() => handleNavigation('/')}>Travel</Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link onClick={() => handleNavigation('/my-trips')}>My Trip</Nav.Link>
                        {/* <Nav.Link onClick={() => handleNavigation('/package')}>Package</Nav.Link> */}
                        <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </>
    );
}

export default NavbarUser;
