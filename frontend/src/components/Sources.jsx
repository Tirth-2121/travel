import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavbarAdmin from './NavbarAdmin';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const SourceTable = () => {
  const token = localStorage.getItem('token');  // Retrieve token from localStorage
  const config = {
    headers: {
      Authorization: `Bearer ${token}` // Send token in Authorization header
    }
  };
  const [sources, setSources] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: ''});
  const navigate = useNavigate();

  const navigateTo = (path) => {
    navigate(path);
  };

  useEffect(() => {
    fetchSources();
  }, []);

  // Fetch all sources
  const fetchSources = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/sources',config); // API route for sources
      setSources(response.data);
    } catch (error) {
      console.error('Error fetching sources:', error);
    }
  };

  // Delete a source with confirmation
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this source?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/sources/${id}`,config);
        fetchSources(); // Refresh the list after deletion
        toast.success('Source deleted successfully!'); // Success toast
      } catch (error) {
        console.error('Error deleting source:', error);
        toast.error('Error deleting source. Please try again.'); // Error toast

      }
    }
  };

  // Handle edit form submit
  const handleEditFormSubmit = async (event) => {
    event.preventDefault();
    const loadingToast = toast.loading('Editing source...');

    try {
      await axios.put(`http://localhost:5000/api/admin/sources/${editId}`, editFormData,config);
      setEditId(null); // Exit edit mode
      fetchSources(); // Refresh the list
      toast.success('Source updated successfully!'); // Success toast

    } catch (error) {
      console.error('Error updating source:', error);
      toast.error('Error updating source. Please try again.'); // Error toast

    }
    finally {
        toast.dismiss(loadingToast); // Dismiss the loading toast
      }
  };

  // Start editing a source
  const handleEditClick = (source) => {
    setEditId(source._id);
    setEditFormData({ name: source.name });
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
          <button style={styles.button} onClick={() => navigateTo('/addsource')}>Add Source</button>
        </div>
        <h1>Source Table</h1>
        {editId ? (
          <form onSubmit={handleEditFormSubmit}>
            <input
              type="text"
              name="name"
              value={editFormData.name}
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
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {sources.map((source) => (
                <tr key={source._id}>
                  <td>{source.name}</td>
                  <td>
                    <button onClick={() => handleEditClick(source)}>Edit</button>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(source._id)}>Delete</button>
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

export default SourceTable;
