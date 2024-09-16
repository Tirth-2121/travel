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
      const response = await axios.get('http://localhost:5000/api/admin/packages',config);
      setPackages(response.data);
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  const fetchSources = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/sources',config);
      setSources(response.data);
    } catch (error) {
      console.error('Error fetching sources:', error);
    }
  };

  const fetchDestinations = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/destinations',config);
      setDestinations(response.data);
    } catch (error) {
      console.error('Error fetching destinations:', error);
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
      const response = await axios.get('http://localhost:5000/api/admin/hotels',config);
      setHotels(response.data);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }
  };

  const fetchTransports = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/transports',config);
      setTransports(response.data);
    } catch (error) {
      console.error('Error fetching transports:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        await axios.delete(`http://localhost:5000/api/admin/packages/${id}`,config);
        fetchPackages(); // Refresh the package list
        toast.success('Package deleted successfully!'); // Success toast

      } catch (error) {
        console.error('Error deleting package:', error);
        toast.error('Error deleting package. Please try again.'); // Error toast

      }
    }
  };

  const handleEditFormSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    const loadingToast = toast.loading('Editing package...');

    const updatedPackageData = { ...editFormData };
  
    if (updatedPackageData.image instanceof File) {
      // Convert image to Base64 if it's a File object
      const reader = new FileReader();
      reader.readAsDataURL(updatedPackageData.image);
      reader.onloadend = async () => {
        updatedPackageData.image = reader.result;
  
        try {
          const response = await axios.put(`http://localhost:5000/api/admin/packages/${editId}`, updatedPackageData,config);
          setEditId(null); // Exit edit mode
          fetchPackages(); // Refresh the package list
          toast.success('Package updated successfully!'); // Success toast

        } catch (error) {
          console.error('Error updating package:', error);
          setError('Error updating package. Please try again.');
          toast.error('Error updating package. Please try again.'); // Error toast

        } finally {
          setIsLoading(false);
          toast.dismiss(loadingToast); // Dismiss the loading toast

        }
      };
    } else {
      // If image is not a File object, just send the data as is
      try {
        const response = await axios.put(`http://localhost:5000/api/admin/packages/${editId}`, updatedPackageData,config);
        setEditId(null); // Exit edit mode
        fetchPackages(); // Refresh the package list
        toast.success('Package updated successfully!'); // Success toast

      } catch (error) {
        console.error('Error updating package:', error);
        setError('Error updating package. Please try again.');
        toast.error('Error updating package. Please try again.'); // Error toast

      } finally {
        setIsLoading(false);
        toast.dismiss(loadingToast); // Dismiss the loading toast

      }
    }
  };
  

  const handleEditClick = (pkg) => {
    setEditId(pkg._id);
    setEditFormData({
      name: pkg.name,
      sourceId: pkg.source._id,
      destinationId: pkg.destination._id,
      hotelId: pkg.hotel._id,
      transportId: pkg.transports._id,
      startDate: pkg.startDate.slice(0, 10), // Format date for input
      endDate: pkg.endDate.slice(0, 10), // Format date for input
      basePrice: pkg.basePrice,
      totalDistance: pkg.totalDistance,
      description: pkg.description || '',
    });
  };

  const handleEditFormChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <NavbarAdmin />
      <DescriptionModal
        isOpen={isModalOpen}
        onClose={closeModal}
        description={modalDescription}
      />
      <div>
        <div style={styles.buttonContainer}>
          <button style={styles.button} onClick={() => navigateTo('/addpackage')}>Add Package</button>
        </div>
        <h1>Package Table</h1>
        {editId ? (
          <form onSubmit={handleEditFormSubmit}>
            <input
              type="text"
              name="name"
              value={editFormData.name}
              onChange={handleEditFormChange}
              placeholder="Package Name"
              required
            />
            <select name="sourceId" value={editFormData.sourceId} onChange={handleEditFormChange} required>
              <option value="">Select Source</option>
              {sources.map((source) => (
                <option key={source._id} value={source._id}>
                  {source.name}
                </option>
              ))}
            </select>
            <select name="destinationId" value={editFormData.destinationId} onChange={handleEditFormChange} required>
              <option value="">Select Destination</option>
              {destinations.map((destination) => (
                <option key={destination._id} value={destination._id}>
                  {destination.name}
                </option>
              ))}
            </select>
            <select name="hotelId" value={editFormData.hotelId} onChange={handleEditFormChange} required>
              <option value="">Select Hotel</option>
              {hotels.map((hotel) => (
                <option key={hotel._id} value={hotel._id}>
                  {hotel.name} - {hotel.destination.name}
                </option>
              ))}
            </select>
            <select name="transportId" value={editFormData.transportId} onChange={handleEditFormChange} required>
              <option value="">Select Transport</option>
              {transports.map((transport) => (
                <option key={transport._id} value={transport._id}>
                  {transport.type} ({transport.from.name} - {transport.to.name})
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
            />
            <input
              type="date"
              name="endDate"
              value={editFormData.endDate}
              onChange={handleEditFormChange}
              min={minStartDate}
              required
            />
            <input
              type="number"
              name="basePrice"
              value={editFormData.basePrice}
              onChange={handleEditFormChange}
              placeholder="Base Price"
              required
            />
            <input
              type="number"
              name="totalDistance"
              value={editFormData.totalDistance}
              onChange={handleEditFormChange}
              placeholder="Total Distance"
              required
            />
            <textarea
              name="description"
              value={editFormData.description}
              onChange={handleEditFormChange}
              placeholder="Package Description"
              required
            />
            <input
                type="file"
                name="image"
                onChange={(e) => {
                    if (e.target.files[0]) {
                    setEditFormData(prev => ({ ...prev, image: e.target.files[0] }));
                    }
                }}
            />
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditId(null)}>Cancel</button>
          </form>
        ) : (
          <table border="1" style={{ width: '100%', textAlign: 'left' }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Source</th>
                <th>Destination</th>
                <th>Hotel</th>
                <th>Transport</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Base Price</th>
                <th>Nights</th>
                <th>Total Distance</th>
                <th>Total Price</th>
                <th>Description</th>
                <th>View Image</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg) => (
                <tr key={pkg._id}>
                  <td>{pkg.name}</td>
                  <td>{pkg.source.name}</td>
                  <td>{pkg.destination.name}</td>
                  <td>{pkg.hotel.name}</td>
                  <td>{pkg.transports.type} ({pkg.transports.from.name} - {pkg.transports.to.name})</td>
                  <td>{new Date(pkg.startDate).toLocaleDateString()}</td>
                  <td>{new Date(pkg.endDate).toLocaleDateString()}</td>
                  <td>{pkg.basePrice}</td>
                  <td>{pkg.nights}</td>
                  <td>{pkg.totalDistance}</td>
                  <td>{pkg.totalPrice}</td>
                  <td>
                  {pkg.description ? (
                    <button onClick={() => openModal(pkg.description)}>
                      View Description
                    </button>
                  ) : (
                    'No Description'
                  )}
                </td>
                  <td>
                  <td>
                        {pkg.image ? (
                            <a
                            href={pkg.image.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            >
                            View Image
                            </a>
                        ) : (
                            'No Image'
                        )}
                    </td>
        </td>
                  <td>
                    <button onClick={() => handleEditClick(pkg)}>Edit</button>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(pkg._id)}>Delete</button>
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

export default PackageTable;
