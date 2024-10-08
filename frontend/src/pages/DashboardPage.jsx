import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavbarAdmin from './NavbarAdmin';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import DescriptionModal from "./DescriptionModal"; // Import the modal

const PackageTable = () => {
  const token = localStorage.getItem('token');  // Retrieve token from localStorage
  const config = {
    headers: {
      Authorization: `Bearer ${token}` // Send token in Authorization header
    }
  };
  const [packages, setPackages] = useState([]);
  const [sources, setSources] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [transports, setTransports] = useState([]);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDescription, setModalDescription] = useState("");
  const today = new Date();
  const minStartDate = new Date(today.setDate(today.getDate() + 30)).toISOString().split('T')[0];
  const [editFormData, setEditFormData] = useState({
    name: '',
    sourceId: '',
    destinationId: '',
    hotelId: '',
    transportId: '',
    startDate: '',
    endDate: '',
    basePrice: '',
    totalDistance: '',
    description: '',
    newImages: [],
    imagesToRemove: [],
    existingImages: []
  });
  const navigate = useNavigate();
  
  const navigateTo = (path) => {
    navigate(path);
  };

  useEffect(() => {
    fetchPackages();
    fetchSources();
    fetchDestinations();
    fetchHotels();
    fetchTransports();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/packages', config);
      setPackages(response.data);
    } catch (error) {
      toast.error(error.response ? error.response.data.message : 'Please try again.'); // Error toast
    }
  };

  const fetchSources = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/places', config);
      setSources(response.data);
    } catch (error) {
      toast.error(error.response ? error.response.data.message : 'Please try again.'); // Error toast
    }
  };

  const fetchDestinations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/places', config);
      setDestinations(response.data);
    } catch (error) {
      toast.error(error.response ? error.response.data.message : 'Please try again.'); // Error toast
    }
  };

  const openModal = (description) => {
    setModalDescription(description);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalDescription("");
  };

  const fetchHotels = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/hotels', config);
      setHotels(response.data);
    } catch (error) {
      toast.error(error.response ? error.response.data.message : 'Please try again.'); // Error toast
    }
  };

  const fetchTransports = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/transports', config);
      setTransports(response.data);
    } catch (error) {
      toast.error(error.response ? error.response.data.message : 'Please try again.'); // Error toast
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/packages/${id}`, config);
        fetchPackages(); // Refresh the package list
        toast.success('Package deleted successfully!'); // Success toast
      } catch (error) {
        console.error('Error deleting package:', error);
        toast.error(error.response ? error.response.data.message : 'Please try again.'); // Error toast
      }
    }
  };

  const handleEditFormSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    const loadingToast = toast.loading('Editing package...');

    const updatedPackageData = { ...editFormData };

    // Convert new images to base64
    const newImagesBase64 = await Promise.all(
      updatedPackageData.newImages.map(file => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
        });
      })
    );

    updatedPackageData.newImages = newImagesBase64;

    try {
      await axios.put(`http://localhost:5000/api/admin/packages/${editId}`, updatedPackageData, config);
      setEditId(null); // Exit edit mode
      fetchPackages(); // Refresh the package list
      toast.success('Package updated successfully!'); // Success toast
    } catch (error) {
      console.error('Error updating package:', error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data.message : 'Error updating package. Please try again.');
      toast.error(error.response ? error.response.data.message : 'Please try again.'); // Error toast
    } finally {
      setIsLoading(false);
      toast.dismiss(loadingToast); // Dismiss the loading toast
    }
  };

  const handleEditClick = (pkg) => {
    setEditId(pkg._id);
    setEditFormData({
      name: pkg.name || 'Unknown',
      sourceId: pkg.source?._id || 'Unknown',
      destinationId: pkg.destination?._id || 'Unknown',
      hotelId: pkg.hotel?._id || 'Unknown',
      transportId: pkg.transports?._id || 'Unknown',
      startDate: pkg.startDate ? pkg.startDate.slice(0, 10) : 'Unknown',
      endDate: pkg.endDate ? pkg.endDate.slice(0, 10) : 'Unknown',
      basePrice: pkg.basePrice || 'Unknown',
      totalDistance: pkg.totalDistance || 'Unknown',
      description: pkg.description || 'Unknown',
      newImages: [],
      imagesToRemove: [],
      existingImages: pkg.images || []
    });
  };

  const handleEditFormChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleImageRemove = (publicId) => {
    setEditFormData({
      ...editFormData,
      imagesToRemove: [...editFormData.imagesToRemove, publicId],
      existingImages: editFormData.existingImages.filter(img => img.public_id !== publicId)
    });
  };

  const handleNewImageChange = (e) => {
    setEditFormData({ ...editFormData, newImages: [...editFormData.newImages, ...e.target.files] });
  };

  return (
    <>
      <NavbarAdmin />
      <DescriptionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        description={modalDescription}
      />
      <div style={styles.container}>
        <div style={styles.buttonContainer}>
          <button style={styles.addButton} onClick={() => navigateTo('/addpackage')}>Add Package</button>
        </div>
        <h1 style={styles.header}>Package Table</h1>
        {editId ? (
          <form onSubmit={handleEditFormSubmit} style={styles.form}>
            <input
              type="text"
              name="name"
              value={editFormData.name}
              onChange={handleEditFormChange}
              placeholder="Package Name"
              required
              style={styles.input}
            />
            <select name="sourceId" value={editFormData.sourceId} onChange={handleEditFormChange} required style={styles.select}>
              <option value="">Select Source</option>
              {sources.map((source) => (
                <option key={source._id} value={source._id}>
                  {source.name || 'Unknown'}
                </option>
              ))}
            </select>
            <select name="destinationId" value={editFormData.destinationId} onChange={handleEditFormChange} required style={styles.select}>
              <option value="">Select Destination</option>
              {destinations.map((destination) => (
                <option key={destination._id} value={destination._id}>
                  {destination.name || 'Unknown'}
                </option>
              ))}
            </select>
            <select name="hotelId" value={editFormData.hotelId} onChange={handleEditFormChange} required style={styles.select}>
              <option value="">Select Hotel</option>
              {hotels.map((hotel) => (
                <option key={hotel._id} value={hotel._id}>
                  {hotel.name || 'Unknown'} - {hotel.place?.name || 'Unknown'}
                </option>
              ))}
            </select>
            <select name="transportId" value={editFormData.transportId} onChange={handleEditFormChange} required style={styles.select}>
              <option value="">Select Transport</option>
              {transports.map((transport) => (
                <option key={transport._id} value={transport._id}>
                  {transport.type || 'Unknown'} ({transport.from?.name || 'Unknown'} - {transport.to?.name || 'Unknown'})
                </option>
              ))}
            </select>
            <input
              type="date"
              name="startDate"
              value={editFormData.startDate}
              onChange={handleEditFormChange}
              min={minStartDate}
              required
              style={styles.input}
            />
            <input
              type="date"
              name="endDate"
              value={editFormData.endDate}
              onChange={handleEditFormChange}
              min={minStartDate}
              required
              style={styles.input}
            />
            <input
              type="number"
              name="basePrice"
              value={editFormData.basePrice}
              onChange={handleEditFormChange}
              placeholder="Base Price"
              required
              style={styles.input}
            />
            <input
              type="number"
              name="totalDistance"
              value={editFormData.totalDistance}
              onChange={handleEditFormChange}
              placeholder="Total Distance"
              required
              style={styles.input}
            />
            <textarea
              name="description"
              value={editFormData.description}
              onChange={handleEditFormChange}
              placeholder="Description"
              rows="4"
              style={styles.textarea}
            />
            <div>
              {editFormData.existingImages.map((img, index) => (
                <div key={index} style={styles.imageContainer}>
                  <img src={img.url} alt={`Package Image ${index + 1}`} style={styles.image} />
                  <button type="button" onClick={() => handleImageRemove(img.public_id)} style={styles.removeButton}>Remove</button>
                </div>
              ))}
            </div>
            <input
              type="file"
              name="newImages"
              multiple
              onChange={handleNewImageChange}
              style={styles.fileInput}
            />
            <button type="submit" style={styles.submitButton} disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit'}
            </button>
            {error && <div style={styles.error}>{error}</div>}
          </form>
        ) : (
          <div>
            {/* Render package table or other content here */}
          </div>
        )}
      </div>
    </>
  );
};

const styles = {
  container: {
    padding: '20px',
  },
  buttonContainer: {
    marginBottom: '20px',
  },
  addButton: {
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
    fontSize: '24px',
    color: '#333'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px'
  },
  select: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px'
  },
  textarea: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px'
  },
  fileInput: {
    border: 'none',
    padding: '10px',
    fontSize: '16px'
  },
  submitButton: {
    backgroundColor: '#28a745',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  error: {
    color: '#dc3545',
    marginTop: '10px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px'
  },
  tableHeader: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '10px'
  },
  tableCell: {
    padding: '10px',
    border: '1px solid #ddd'
  },
  viewButton: {
    backgroundColor: '#17a2b8',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  editButton: {
    backgroundColor: '#ffc107',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
    marginRight: '5px'
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  imageContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px'
  },
  image: {
    width: '100px',
    height: 'auto',
    marginRight: '10px'
  },
  removeButton: {
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer'
  }
};

export default PackageTable;