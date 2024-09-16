import  { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from './NavbarAdmin';
import toast from 'react-hot-toast';
const AddTransportForm = () => {
  const [type, setType] = useState('');
  const [destinations, setDestinations] = useState([]);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');
  const [sources, setSources] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');  // Retrieve token from localStorage
  const config = {
    headers: {
      Authorization: `Bearer ${token}` // Send token in Authorization header
    }
  };
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/destinations',config);
        setDestinations(response.data);
      } catch (error) {
        console.error('Error fetching destinations:', error);
      }
    };

    const fetchSources = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/sources',config);
        setSources(response.data);
      } catch (error) {
        console.error('Error fetching destinations:', error);
      }
    };

    fetchDestinations();
    fetchSources();
  }, []);

  const handleSubmit = async (e) => {
    const loadingToast = toast.loading('Creating transport...');

    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/admin/transports', {
        type,
        from,
        to,
        price,
      },config);
      setMessage('Transport added successfully!');
      setType('');
      setFrom('');
      setTo('');
      setPrice('');
      toast.success('Transport created successfully!');

    } catch (error) {
      setMessage('Failed to add transport');
      console.error(error);
      toast.error('Error creating transport. Please try again.');
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
      <h2 style={{fontSize:"25px"}}>Add Transport</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Type</label>
          <div>
            <label>
              <input
              style={{ border: "2px solid black" }}
                type="radio"
                value="train"
                checked={type === 'train'}
                onChange={(e) => setType(e.target.value)}
                required
              />
              Train
            </label>
            <label>
              <input
              style={{ border: "2px solid black" }}
                type="radio"
                value="bus"
                checked={type === 'bus'}
                onChange={(e) => setType(e.target.value)}
                required
              />
              Bus
            </label>
            <label>
              <input
              style={{ border: "2px solid black" }}
                type="radio"
                value="AeroPlane"
                checked={type === 'AeroPlane'}
                onChange={(e) => setType(e.target.value)}
                required
              />
              AeroPlane
            </label>
          </div>
        </div>
        <div>
          <label>From</label>
          <select
          style={{ border: "2px solid black" }}
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            required
          >
            <option value="">Select a Source</option>
            {sources.map((source) => (
              <option key={source._id} value={source._id}>
                {source.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>To</label>
          <select
            value={to}
            style={{ border: "2px solid black" }}
            onChange={(e) => setTo(e.target.value)}
            required
          >
            <option value="">Select a Destination</option>
            {destinations.map((destination) => (
              <option key={destination._id} value={destination._id}>
                {destination.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Price</label>
          <input
          style={{ border: "2px solid black" }}
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <button type="submit" style={{backgroundColor:"black",color:"white"}}>Add Transport</button>
      </form>
    </div>
   </>
  );
};

export default AddTransportForm;
