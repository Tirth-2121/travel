import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavbarAdmin from './NavbarAdmin';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const HotelTable = () => {
  const token = localStorage.getItem('token');  // Retrieve token from localStorage
  const config = {
    headers: {
      Authorization: `Bearer ${token}` // Send token in Authorization header
    }
  };
  const [hotels, setHotels] = useState([]);
  const [destinations, setDestinations] = useState([]); // Store all destinations
  const [editId, setEditId] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', destination: '', pricePerNight: '' });
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };

  useEffect(() => {
    fetchHotels();
    fetchDestinations(); // Fetch destinations for the dropdown
  }, []);

  // Fetch all hotels with populated destination name
  const fetchHotels = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/hotels',config); // Adjust your API route as necessary
      setHotels(response.data);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }
  };

  // Fetch all destinations for the dropdown
  const fetchDestinations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/destinations',config);
      setDestinations(response.data);
    } catch (error) {
      console.error('Error fetching destinations:', error);
    }
  };

  // Delete a hotel with confirmation
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this hotel?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/hotels/${id}`,config);
        fetchHotels(); // Refresh the list after deletion
        toast.success('Hotel deleted successfully!'); // Success toast
      } catch (error) {
        console.error('Error deleting hotel:', error);
        toast.error('Error deleting hotel. Please try again.'); // Error toast

      }
    }
  };

  // Handle edit form submit
  const handleEditFormSubmit = async (event) => {
    event.preventDefault();
    const loadingToast = toast.loading('Editing Hotel...');

    try {
      await axios.put(`http://localhost:5000/api/admin/hotels/${editId}`, editFormData,config);
      setEditId(null); // Exit edit mode
      fetchHotels(); // Refresh the list
      toast.success('Hotel updated successfully!'); // Success toast

    } catch (error) {
      console.error('Error updating hotel:', error);
      toast.error('Error updating hotel. Please try again.'); // Error toast

    }
    finally {
        toast.dismiss(loadingToast); // Dismiss the loading toast
      }
  };

  // Start editing a hotel
  const handleEditClick = (hotel) => {
    setEditId(hotel._id);
    setEditFormData({
      name: hotel.name,
      destination: hotel.destination._id, // Set destination id for the dropdown
      pricePerNight: hotel.pricePerNight,
    });
  };

  // Handle form input changes
  const handleEditFormChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <NavbarAdmin />
      <div>
        <div style={styles.buttonContainer}>
          <button style={styles.button} onClick={() => navigateTo('/addhotel')}>Add Hotel</button>
        </div>
        <h1>Hotel Table</h1>
        {editId ? (
          <form onSubmit={handleEditFormSubmit}>
            <input
              type="text"
              name="name"
              value={editFormData.name}
              onChange={handleEditFormChange}
              required
            />
            {/* Dropdown for selecting the destination */}
            <select
              name="destination"
              value={editFormData.destination}
              onChange={handleEditFormChange}
              required
            >
              <option value="">Select Destination</option>
              {destinations.map((destination) => (
                <option key={destination._id} value={destination._id}>
                  {destination.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              name="pricePerNight"
              value={editFormData.pricePerNight}
              onChange={handleEditFormChange}
              required
            />
            <button type="submit">Save</button>
            <button onClick={() => setEditId(null)}>Cancel</button>
          </form>
        ) : (
          <table border="1" style={{ width: '100%', textAlign: 'left' }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Destination</th>
                <th>Price per Night</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {hotels.map((hotel) => (
                <tr key={hotel._id}>
                  <td>{hotel.name}</td>
                  <td>{hotel.destination?.name || "Unknown"}</td> {/* Handle case when destination is not available */}
                  <td>{hotel.pricePerNight}</td>
                  <td>
                    <button onClick={() => handleEditClick(hotel)}>Edit</button>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(hotel._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

const styles = {
  heading: {
    fontSize: "32px",
  },
  container: {
    textAlign: 'center',
    padding: '50px',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
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

export default HotelTable;
