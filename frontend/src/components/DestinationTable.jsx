import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavbarAdmin from './NavbarAdmin';
import AddDestinationForm from './AddDestinationForm';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const DestinationTable = () => {
  const token = localStorage.getItem('token');  // Retrieve token from localStorage
  const config = {
    headers: {
      Authorization: `Bearer ${token}` // Send token in Authorization header
    }
  };
  const [destinations, setDestinations] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', description: '' });
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };
  useEffect(() => {
    fetchDestinations();
  }, []);

  // Fetch all destinations
  const fetchDestinations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/destinations',config); // Adjust your API route as necessary
      setDestinations(response.data);
    } catch (error) {
      console.error('Error fetching destinations:', error);
      toast.error('Error in fetching data');
    }
  };

  // Delete a destination
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this destination?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/destinations/${id}`,config);
        fetchDestinations(); // Refresh the list after deletion
        toast.success('Destination deleted successfully!'); // Success toast
      } catch (error) {
        console.error('Error deleting destination:', error);
        toast.error('Error deleting destination. Please try again.'); // Error toast

      }
    }
  };

  // Handle edit form submit
  const handleEditFormSubmit = async (event) => {
    event.preventDefault();
    const loadingToast = toast.loading('Editing destination...');

    try {
      await axios.put(`http://localhost:5000/api/admin/destinations/${editId}`, editFormData,config);
      setEditId(null); // Exit edit mode
      fetchDestinations(); // Refresh the list
      toast.success('Destination updated successfully!'); // Success toast

    } catch (error) {
      console.error('Error updating destination:', error);
      toast.error('Error updating destination. Please try again.'); // Error toast

    }
    finally {
        toast.dismiss(loadingToast); // Dismiss the loading toast
      }
  };

  // Start editing a destination
  const handleEditClick = (destination) => {
    setEditId(destination._id);
    setEditFormData({ name: destination.name, description: destination.description });
  };

  // Handle form input changes
  const handleEditFormChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  return (
  <>
    <NavbarAdmin></NavbarAdmin>
    <div>

    <div style={styles.buttonContainer}>
        <button style={styles.button} onClick={() => navigateTo('/adddestination')}>Add Destinations</button>
      </div>
      <h1>Destination Table</h1>
      {editId ? (
        <form onSubmit={handleEditFormSubmit}>
          <input
            type="text"
            name="name"
            value={editFormData.name}
            onChange={handleEditFormChange}
            required
          />
          <input
            type="text"
            name="description"
            value={editFormData.description}
            onChange={handleEditFormChange}
          />
          <button type="submit">Save</button>
          <button onClick={() => setEditId(null)}>Cancel</button>
        </form>
      ) : (
        <table border="1" style={{ width: '100%', textAlign: 'left' }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {destinations.map((destination) => (
              <tr key={destination._id}>
                <td>{destination.name}</td>
                <td>{destination.description}</td>
                <td>
                  <button onClick={() => handleEditClick(destination)}>Edit</button>
                </td>
                <td>
                  <button onClick={() => handleDelete(destination._id)}>Delete</button>
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
      fontSize:"32px",
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
export default DestinationTable;
