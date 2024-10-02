import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import NavbarUser from '../components/NavbarUser';
import { Card, CardMedia, CardContent, Typography, Button, Stack, Divider, IconButton, CardActions, TextField } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';

const DashboardPage1 = () => {
  const token = localStorage.getItem('token');  // Retrieve token from localStorage
  const user = JSON.parse(localStorage.getItem('user')); // Retrieve user ID from localStorage
  const userId = user._id;
  const config = {
    headers: {
      Authorization: `Bearer ${token}` // Send token in Authorization header
    }
  };
  const navigate = useNavigate();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { logout } = useAuthStore();
  const [favorites, setFavorites] = useState([]);

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

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/admin/users/${userId}/favorites`, config);
        setFavorites(response.data);
      } catch (err) {
        console.error('Failed to fetch favorite packages', err);
      }
    };

    fetchFavorites();
  }, [userId, config]);

  const handleFavoriteToggle = async (pkg) => {
    try {
      if (favorites.some(fav => fav._id === pkg._id)) {
        // console.log(`Removing package ${pkg._id} from favorites`);
        await axios.delete(`http://localhost:5000/api/admin/users/${userId}/favorites/${pkg._id}`, config);
        setFavorites(favorites.filter(fav => fav._id !== pkg._id));
      } else {
        // console.log(`Adding package ${pkg._id} to favorites`);
        await axios.post(`http://localhost:5000/api/admin/users/${userId}/favorites/${pkg._id}`, {}, config);
        setFavorites([...favorites, pkg]);
      }
    } catch (err) {
      console.error('Failed to toggle favorite package', err);
    }
  };

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

  const filteredPackages = packages.filter(pkg =>
    pkg.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <NavbarUser />
      <div style={styles.searchContainer}>
        <TextField
          label="Search Packages"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div style={styles.gridContainer}>
        {filteredPackages.map((pkg, index) => (
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
              <IconButton onClick={() => handleFavoriteToggle(pkg)}>
                {favorites.some(fav => fav._id === pkg._id) ? (
                  <Favorite sx={{ color: 'red' }} />
                ) : (
                  <FavoriteBorder sx={{ color: 'black' }} />
                )}
              </IconButton>
            </CardActions>
          </Card>
        ))}
      </div>
    </>
  );
};

const styles = {
  searchContainer: {
    padding: '20px',
    display: 'flex',
    justifyContent: 'center',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    padding: '20px',
    justifyContent: 'center',
  },
};

export default DashboardPage1;