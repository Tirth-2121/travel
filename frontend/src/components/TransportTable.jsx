import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavbarAdmin from './NavbarAdmin';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const TransportTable = () => {
  const token = localStorage.getItem('token');  // Retrieve token from localStorage
  const config = {
    headers: {
      Authorization: `Bearer ${token}` // Send token in Authorization header
    }
  };
  const [transports, setTransports] = useState([]);
  const [sources, setSources] = useState([]); // List of available sources
  const [destinations, setDestinations] = useState([]); // List of available destinations
  const [editId, setEditId] = useState(null);
  const [editFormData, setEditFormData] = useState({ type: '', from: '', to: '', price: '' });
  const navigate = useNavigate();
  const navigateTo = (path) => {
    navigate(path);
  };
  useEffect(() => {
    fetchTransports();
    fetchSources();
    fetchDestinations();
  }, []);

  // Fetch all transports with populated from and to fields
  const fetchTransports = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/transports',config);
      setTransports(response.data);
    } catch (error) {
      console.error('Error fetching transports:', error);
    }
  };

  // Fetch all sources for dropdown
  const fetchSources = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/sources',config);
      setSources(response.data);
    } catch (error) {
      console.error('Error fetching sources:', error);
    }
  };

  // Fetch all destinations for dropdown
  const fetchDestinations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/destinations',config);
      setDestinations(response.data);
    } catch (error) {
      console.error('Error fetching destinations:', error);
    }
  };

  // Delete a transport
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transport?')) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/transports/${id}`,config);
        fetchTransports(); // Refresh the transport list
        toast.success('Transport deleted successfully!'); // Success toast
      } catch (error) {
        console.error('Error deleting transport:', error);
        toast.error('Error deleting transport. Please try again.'); // Error toast
      }
    }
  };

  // Handle edit form submit
  const handleEditFormSubmit = async (event) => {
    event.preventDefault();
    const loadingToast = toast.loading('Editing transport...');

    try {
      await axios.put(`http://localhost:5000/api/admin/transports/${editId}`, editFormData,config);
      setEditId(null); // Exit edit mode
      fetchTransports(); // Refresh the transport list
      toast.success('Transport updated successfully!'); // Success toast

    } catch (error) {
      console.error('Error updating transport:', error);
      toast.error('Error updating transport. Please try again.'); // Error toast

    }
    finally {
        toast.dismiss(loadingToast); // Dismiss the loading toast
      }
  };

  // Start editing a transport
  const handleEditClick = (transport) => {
    setEditId(transport._id);
    setEditFormData({
      type: transport.type,
      from: transport.from._id,
      to: transport.to._id,
      price: transport.price
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
          <button style={styles.button} onClick={() => navigateTo('/addtransport')}>Add Transport</button>
        </div>
        <h1>Transport Table</h1>
        {editId ? (
          <form onSubmit={handleEditFormSubmit}>
            {/* Transport type */}
            <select name="type" value={editFormData.type} onChange={handleEditFormChange} required>
              <option value="">Select Transport Type</option>
              <option value="train">Train</option>
              <option value="bus">Bus</option>
              <option value="AeroPlane">AeroPlane</option>
            </select>

            {/* From (Source) */}
            <select name="from" value={editFormData.from} onChange={handleEditFormChange} required>
              <option value="">Select Source</option>
              {sources.map((source) => (
                <option key={source._id} value={source._id}>
                  {source.name}
                </option>
              ))}
            </select>

            {/* To (Destination) */}
            <select name="to" value={editFormData.to} onChange={handleEditFormChange} required>
              <option value="">Select Destination</option>
              {destinations.map((destination) => (
                <option key={destination._id} value={destination._id}>
                  {destination.name}
                </option>
              ))}
            </select>

            {/* Price */}
            <input
              type="number"
              name="price"
              value={editFormData.price}
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
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th>Price</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {transports.map((transport) => (
                <tr key={transport._id}>
                  <td>{transport.type}</td>
                  <td>{transport.from.name}</td> {/* Display source name */}
                  <td>{transport.to.name}</td> {/* Display destination name */}
                  <td>{transport.price}</td>
                  <td>
                    <button onClick={() => handleEditClick(transport)}>Edit</button>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(transport._id)}>Delete</button>
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
export default TransportTable;
