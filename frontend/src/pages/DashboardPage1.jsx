import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import NavbarUser from '../components/NavbarUser';

const DashboardPage1 = () => {
  const token = localStorage.getItem('token');  // Retrieve token from localStorage
  const config = {
    headers: {
      Authorization: `Bearer ${token}` // Send token in Authorization header
    }
  };
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logout } = useAuthStore();

  useEffect(() => {
    // Fetch the package details from the API
    const fetchPackages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/packages',config);
        setPackages(response.data); // assuming the response data is an array of packages
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch packages');
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  const handleApply = (pkg) => {
    // Navigate to the apply package page with the package details
    navigate('/apply-package', { state: { package: pkg } });
  };
  const handleLogout = () => {
    // Clear localStorage and logout the user
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    logout();

    // Redirect to the login page
    navigate('/');
  };
  // Function to check if the apply button should be disabled
  const isApplyButtonDisabled = (startDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const deadline = new Date(start);
    deadline.setDate(start.getDate() - 3);

    // Disable if today's date is greater than the deadline
    return today > deadline;
  };

  return (
    <>
    <NavbarUser></NavbarUser>
      <div style={styles.gridContainer}>
        {packages.map((pkg, index) => (
          <div key={index} style={styles.card}>
          {pkg.image && (
              <img
                src={pkg.image.url}
                alt={pkg.name}
                style={styles.image}
              />
            )}
            <h3 style={styles.title}>Package Name: {pkg.name}</h3>
            <p><strong>Source:</strong> {pkg.source.name}</p>
            <p><strong>Destination:</strong> {pkg.destination.name}</p>
            <p><strong>Start Date:</strong> {new Date(pkg.startDate).toLocaleDateString()}</p>
            <p><strong>End Date:</strong> {new Date(pkg.endDate).toLocaleDateString()}</p>
            <p><strong>Nights:</strong> {pkg.nights}</p>
            <p><strong>Total Price:</strong> ₹{pkg.totalPrice}</p>
            <button
              style={styles.button}
              onClick={() => handleApply(pkg)}
              disabled={isApplyButtonDisabled(pkg.startDate)}
            >
              {isApplyButtonDisabled(pkg.startDate) ? 'Registration Closed' : 'Apply'}
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

const styles = {
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    padding: '20px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden', // To handle overflow of image
  },
  title: {
    fontSize: '20px',
    marginBottom: '10px',
  },
  image: {
    width: '47%', // Ensures the image fits the container width
    height: 'auto', // Maintains aspect ratio
    objectFit: 'cover', // Crops the image to fit the container without stretching
    borderRadius: '8px',
    marginBottom: '10px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#007BFF',
    color: 'white',
    transition: 'background-color 0.3s',
  },
};



export default DashboardPage1;
