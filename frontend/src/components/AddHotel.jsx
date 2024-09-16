import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from './NavbarAdmin';
import toast from 'react-hot-toast';
const AddHotelForm = () => {
  const [name, setName] = useState('');
  const [destination, setDestination] = useState('');
  const [pricePerNight, setPricePerNight] = useState('');
  const [destinations, setDestinations] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const token = localStorage.getItem('token');  // Retrieve token from localStorage
        const config = {
          headers: {
            Authorization: `Bearer ${token}` // Send token in Authorization header
          }
        };
        const response = await axios.get('http://localhost:5000/api/admin/destinations',config);
        setDestinations(response.data);
      } catch (error) {
        console.error('Error fetching destinations:', error);
      }
    };

    fetchDestinations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Creating hotel...');

    try {
      const token = localStorage.getItem('token');  // Retrieve token from localStorage
      const config = {
        headers: {
          Authorization: `Bearer ${token}` // Send token in Authorization header
        }
      };
      const response = await axios.post('http://localhost:5000/api/admin/hotels', {
        name,
        destination,
        pricePerNight,
      },config);
      setMessage('Hotel added successfully!');
      setName('');
      setDestination('');
      setPricePerNight('');
      toast.success('Hotel created successfully!');

    } catch (error) {
      setMessage('Failed to add hotel');
      console.error(error);
      toast.error('Error creating hotel. Please try again.');

    }
    finally {
      toast.dismiss(loadingToast); // Dismiss the loading toast
    }
  };

  return (
    <>
      <NavbarAdmin></NavbarAdmin>
      <div>
          <button onClick={() => navigate(-1)}>Back</button>
      <h2 style={{fontSize:"25px"}}>Add Hotel</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
          style={{ border: "2px solid black" }}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Destination</label>
          <select
          style={{ border: "2px solid black" }}
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
          >
            <option value="">Select a destination</option>
            {destinations.map((dest) => (
              <option key={dest._id} value={dest._id}>
                {dest.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Price Per Night</label>
          <input
          style={{ border: "2px solid black" }}
            type="number"
            value={pricePerNight}
            onChange={(e) => setPricePerNight(e.target.value)}
            required
          />
        </div>
        <button type="submit" style={{backgroundColor:"black",color:"white"}}>Add Hotel</button>
      </form>
    </div>
    </>
  );
};

export default AddHotelForm;
