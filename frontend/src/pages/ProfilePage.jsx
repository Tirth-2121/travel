import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarUser from "../components/NavbarUser";
import { Container, Typography, Paper, Button } from '@mui/material';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = () => {
      try {
        const user = JSON.parse(localStorage.getItem('user')); // Retrieve user data from localStorage
        if (user) {
          setUserData(user);
        } else {
          console.error('No user data found in localStorage');
        }
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    };

    fetchUserData();
  }, []);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <NavbarUser />
      <Container maxWidth="sm" style={{ marginTop: '20px' }}>
        <Paper elevation={3} style={{ padding: '20px' }}>
          <Typography variant="h4" gutterBottom><strong>Profile</strong></Typography>
          <Typography variant="h6"><strong>Name:</strong> {userData.name}</Typography>
          <Typography variant="h6"><strong>Email:</strong> {userData.email}</Typography>
          {/* Add more user details here */}
          <Button variant="contained" color="primary" onClick={() => navigate('/')} style={{ marginTop: '20px' }}>
            Back
          </Button>
        </Paper>
      </Container>
    </>
  );
};

export default ProfilePage;