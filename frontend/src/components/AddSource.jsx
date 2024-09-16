import  { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from './NavbarAdmin';
import toast from 'react-hot-toast';
const AddSourceForm = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    const loadingToast = toast.loading('Creating source...');

    e.preventDefault();
    try {
      const token = localStorage.getItem('token');  // Retrieve token from localStorage
      const config = {
        headers: {
          Authorization: `Bearer ${token}` // Send token in Authorization header
        }
      };
      const response = await axios.post('http://localhost:5000/api/admin/sources', { name},config);
      setMessage('Source added successfully!');
      setName('');
      toast.success('Source created successfully!');

    } catch (error) {
      setMessage('Failed to add source');
      console.error(error);
      toast.error('Error creating source. Please try again.');

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
      <h2 style={{fontSize:"25px"}}>Add Source</h2>
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
        <button type="submit"style={{backgroundColor:"black",color:"white"}}>Add Source</button>
      </form>
    </div>
  </>
  );
};

export default AddSourceForm;