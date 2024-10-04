import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import NavbarUser from '../components/NavbarUser';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Stack,
  Divider,
  IconButton,
  CardActions,
  TextField,
} from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import LoadingSpinner from '../components/LoadingSpinner';

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
  const [appliedPackages, setAppliedPackages] = useState([]); // State to store applied packages

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

  useEffect(() => {
    const fetchAppliedPackages = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/admin/user/${userId}/bookings`, config);
        console.log(response.data);
        setAppliedPackages(response.data);
      } catch (err) {
        console.error('Failed to fetch applied packages', err);
      }
    };

    fetchAppliedPackages();
  }, [userId, config]);

  const handleFavoriteToggle = async (pkg) => {
    try {
      if (favorites.some(fav => fav._id === pkg._id)) {
        await axios.delete(`http://localhost:5000/api/admin/users/${userId}/favorites/${pkg._id}`, config);
        setFavorites(favorites.filter(fav => fav._id !== pkg._id));
      } else {
        await axios.post(`http://localhost:5000/api/admin/users/${userId}/favorites/${pkg._id}`, {}, config);
        setFavorites([...favorites, pkg]);
      }
    } catch (err) {
      console.error('Failed to toggle favorite package', err);
    }
  };

  if (loading) {
    return <div><LoadingSpinner/></div>;
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
          <Card key={index} sx={styles.card}>
            {pkg.images && (
              <CardMedia
                component="img"
                height="180"
                image={pkg.images[0]?.url || '/placeholder.svg'}
                alt={pkg.name || 'Unknown'}
                style={styles.cardMedia}
              />
            )}
            <CardContent>
              <Stack spacing={2}>
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
                <Typography variant="h6" color="blue.600" sx={{ fontWeight: 'bold' }}>
                  ₹{pkg.totalPrice || 'Unknown'}
                </Typography>
              </Stack>
            </CardContent>
            <Divider />
            <CardActions sx={styles.cardActions}>
              {appliedPackages.some(appliedPkg => appliedPkg.package._id === pkg._id) ? (
                <Button variant="contained" color="secondary" disabled sx={{ flexGrow: 1 }}>
                  Already Applied
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleApply(pkg)}
                  disabled={isApplyButtonDisabled(pkg.startDate)}
                  sx={{ flexGrow: 1 }}
                >
                  {isApplyButtonDisabled(pkg.startDate) ? 'Registration Closed' : 'Apply'}
                </Button>
              )}
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
  card: {
    borderRadius: '12px',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  },
  cardMedia: {
    borderRadius: '12px 12px 0 0',
  },
  cardActions: {
    justifyContent: 'space-between',
  },
};

export default DashboardPage1;
