import  { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from './NavbarAdmin';
import toast from 'react-hot-toast';
const AddDestinationForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    const loadingToast = toast.loading('Creating destination...');

    e.preventDefault();
    try {
      const token = localStorage.getItem('token');  // Retrieve token from localStorage
    const config = {
      headers: {
        Authorization: `Bearer ${token}` // Send token in Authorization header
      }
    };

      const response = await axios.post('http://localhost:5000/api/admin/destinations', { name, description },config);
      setMessage('Destination added successfully!');
      setName('');
      setDescription('');
      toast.success('Destination created successfully!');

    } catch (error) {
      setMessage('Failed to add destination');
      console.error(error);
      toast.error('Error creating destination. Please try again.');

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
      <h2 style={{fontSize:"25px"}}>Add Destination</h2>
      {message && <p style={{color:"black"}}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            style={{ border: "2px solid black" }}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
          style={{ border: "2px solid black" }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit" style={{backgroundColor:"black",color:"white"}}>Add Destination</button>
      </form>
    </div>
   </>
  );
};

export default AddDestinationForm;
