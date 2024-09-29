import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import NavbarUser from '../components/NavbarUser';
import { Card, CardMedia, CardContent, Typography, Button, Stack, Divider, CardActions } from '@mui/material';

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
    const fetchPackages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/packages', config);
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
    navigate('/apply-package', { state: { package: pkg } });
  };

  const isApplyButtonDisabled = (startDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const deadline = new Date(start);
    deadline.setDate(start.getDate() - 3);

    return today > deadline;
  };

  return (
    <>
      <NavbarUser />
      <div style={styles.gridContainer}>
        {packages.map((pkg, index) => (
          <Card key={index} sx={{ maxWidth: 345, margin: '20px', borderRadius: '12px', boxShadow: 3 }}>
            {pkg.images && (
              <CardMedia
                component="img"
                height="140"
                image={pkg.images[0]?.url || '/placeholder.svg'}
                alt={pkg.name || 'Unknown'}
                style={{ borderRadius: '12px 12px 0 0' }}
              />
            )}
            <CardContent>
              <Stack spacing={3}>
                <Typography gutterBottom variant="h5" component="div">
                  {pkg.name || 'Unknown'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Source:</strong> {pkg.source?.name || 'Unknown'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Destination:</strong> {pkg.destination?.name || 'Unknown'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Start Date:</strong> {pkg.startDate ? new Date(pkg.startDate).toLocaleDateString() : 'Unknown'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>End Date:</strong> {pkg.endDate ? new Date(pkg.endDate).toLocaleDateString() : 'Unknown'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  <strong>Nights:</strong> {pkg.nights || 'Unknown'}
                </Typography>
                <Typography variant="h6" color="blue.600">
                  ₹{pkg.totalPrice || 'Unknown'}
                </Typography>
              </Stack>
            </CardContent>
            <Divider />
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleApply(pkg)}
                disabled={isApplyButtonDisabled(pkg.startDate)}
                sx={{ flexGrow: 1 }}
              >
                {isApplyButtonDisabled(pkg.startDate) ? 'Registration Closed' : 'Apply'}
              </Button>
            </CardActions>
          </Card>
        ))}
      </div>
    </>
  );
};

const styles = {
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    padding: '20px',
    justifyContent: 'center',
  },
};

export default DashboardPage1;