import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import NavbarUser from '../components/NavbarUser';

const MyTripsPage = () => {
  const token = localStorage.getItem('token');  // Retrieve token from localStorage
  const config = {
    headers: {
      Authorization: `Bearer ${token}` // Send token in Authorization header
    }
  };
  const { user } = useAuthStore(); // Get user from context
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/admin/user/${user._id}/bookings`,config);
        setBookings(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch bookings');
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
   <>
    <NavbarUser></NavbarUser>
    <div>
      {bookings.length === 0 ? (
        <p>No trips found.</p>
      ) : (
        <div>
          {bookings.map((booking) => (
            <div key={booking._id} style={styles.card}>
              <h1 style={styles.font_head}>{booking.package.name}</h1>
              <p><strong>Source:</strong> {booking.package.source.name}</p>
              <p><strong>Destination:</strong> {booking.package.destination.name}</p>
              <p><strong>Start Date:</strong> {new Date(booking.package.startDate).toLocaleDateString()}</p>
              <p><strong>End Date:</strong> {new Date(booking.package.endDate).toLocaleDateString()}</p>
              <p><strong>Nights:</strong> {booking.package.nights}</p>
              <p><strong>Total Cost:</strong> ₹{booking.totalCost}</p>
              <p><strong>Number of People:</strong> {booking.people.length}</p>
            </div>
          ))}
        </div>
      )}
    </div>
   </>
  );
};

const styles = {
  card: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
  },
  font_head : {
    fontSize: '25px'
  }
};

export default MyTripsPage;
