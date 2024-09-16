import  { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from './NavbarAdmin';
import toast from 'react-hot-toast';

const AddPackage = () => {
  const [packageData, setPackageData] = useState({
    name: '',
    sourceId: '',
    destinationId: '',
    hotelId: '',
    transportId: '',
    startDate: '',
    endDate: '',
    basePrice: '',
    totalDistance: '',
    image: '', // Adding image field to packageData
    description: ''
  });
  const navigate = useNavigate();
  const today = new Date();
  const minStartDate = new Date(today.setDate(today.getDate() + 30)).toISOString().split('T')[0];
  const [sourceId , setSourceId] = useState([]);
  const [destinationId, setDestinationId] = useState([]);
  const [hotelId, setHotelId] = useState([]);
  const [transportId, setTransportId] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');  // Retrieve token from localStorage
        const config = {
          headers: {
            Authorization: `Bearer ${token}` // Send token in Authorization header
          }
        };
        const [sourcesRes, destinationsRes, hotelsRes, transportsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/sources',config),
          axios.get('http://localhost:5000/api/admin/destinations',config),
          axios.get('http://localhost:5000/api/admin/hotels',config),
          axios.get('http://localhost:5000/api/admin/transports',config)
        ]);
        setSourceId(sourcesRes.data);
        setDestinationId(destinationsRes.data);
        setHotelId(hotelsRes.data);
        setTransportId(transportsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch initial data. Please refresh the page.');
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPackageData(prev => ({ ...prev, [name]: value }));
  };

  const handleTransportChange = (e) => {
    const selectedValue = e.target.value;
    setPackageData(prev => ({ ...prev, transportId: selectedValue }));
  };

  // Handling image file input and converting to Base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFileToBase(file);
  };

  const setFileToBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPackageData(prev => ({ ...prev, image: reader.result })); // Save Base64 image to packageData
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
     // Show loading toast
     const loadingToast = toast.loading('Creating package...');

    try {
      const token = localStorage.getItem('token');  // Retrieve token from localStorage
      const config = {
        headers: {
          Authorization: `Bearer ${token}` // Send token in Authorization header
        }
      };
      const response = await axios.post('http://localhost:5000/api/admin/packages', packageData,config);
      setPackageData({
        name: '',
        sourceId: '',
        destinationId: '',
        hotelId: '',
        transportId: '',
        startDate: '',
        endDate: '',
        basePrice: '',
        totalDistance: '',
        image: '',
        description: ''
      });
      toast.success('Package created successfully!');
    } catch (error) {
      console.error('Error creating package:', error);
      toast.error('Error creating package. Please try again.');

      setError('Error creating package. Please try again.');
    } finally {
      setIsLoading(false);
      toast.dismiss(loadingToast); // Dismiss the loading toast

    }
  };

  return (
   <>
    <NavbarAdmin />
     <div>
       <button onClick={() => navigate(-1)}>Back</button>
      <h2 style={{fontSize:"25px"}}>Add New Package</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Package Name:</label>
          <input
            style={{ border: "2px solid black" }}
            type="text"
            id="name"
            name="name"
            value={packageData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="sourceId">Source:</label>
          <select
            style={{ border: "2px solid black" }}
            id="sourceId"
            name="sourceId"
            value={packageData.sourceId}
            onChange={handleChange}
            required
          >
            <option value="">Select Source</option>
            {sourceId.map(source => (
              <option key={source._id} value={source._id}>{source.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="destinationId">Destination:</label>
          <select
            style={{ border: "2px solid black" }}
            id="destinationId"
            name="destinationId"
            value={packageData.destinationId}
            onChange={handleChange}
            required
          >
            <option value="">Select Destination</option>
            {destinationId.map(destination => (
              <option key={destination._id} value={destination._id}>{destination.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="transports">Transports:</label>
          <select
            style={{ border: "2px solid black" }}
            id="transports"
            name="transports"
            value={packageData.transportId}
            onChange={handleTransportChange}
            required
          >
            <option value="">Select Path</option>
            {transportId.map(transport => (
              <option key={transport._id} value={transport._id}>
                {transport.type} from {transport.from.name} to {transport.to.name} - ₹{transport.price}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="hotelId">Hotel:</label>
          <select
            style={{ border: "2px solid black" }}
            id="hotelId"
            name="hotelId"
            value={packageData.hotelId}
            onChange={handleChange}
            required
          >
            <option value="">Select Hotel</option>
            {hotelId.map(hotel => (
              <option key={hotel._id} value={hotel._id}>{hotel.name} - {hotel.destination.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="startDate">Start Date:</label>
          <input
            style={{ border: "2px solid black" }}
            type="date"
            id="startDate"
            name="startDate"
            value={packageData.startDate}
            onChange={handleChange}
            min={minStartDate}
            required
          />
        </div>

        <div>
          <label htmlFor="endDate">End Date:</label>
          <input
            style={{ border: "2px solid black" }}
            type="date"
            id="endDate"
            name="endDate"
            value={packageData.endDate}
            onChange={handleChange}
            min={minStartDate}
            required
          />
        </div>

        <div>
          <label htmlFor="basePrice">Base Price:</label>
          <input
            style={{ border: "2px solid black" }}
            type="number"
            id="basePrice"
            name="basePrice"
            value={packageData.basePrice}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="totalDistance">Total Distance:</label>
          <input
            style={{ border: "2px solid black" }}
            type="number"
            id="totalDistance"
            name="totalDistance"
            value={packageData.totalDistance}
            onChange={handleChange}
            required
          />
        </div>
        <div>
            <label htmlFor="description">Package Description:</label>
            <textarea
              style={{ border: '2px solid black' }}
              id="description"
              name="description"
              value={packageData.description}
              onChange={handleChange}
              required
            />
          </div>
        <div>
          <label htmlFor="image">Package Image:</label>
          <input
            style={{ border: "2px solid black" }}
            type="file"
            id="image"
            name="image"
            onChange={handleImageChange}
            required
          />
        </div>

        {/* Displaying the uploaded image */}
        {packageData.image && (
          <div>
            <img
              src={packageData.image}
              alt="Package"
              style={{ maxWidth: "200px", maxHeight: "150px", marginTop: "10px" }}
            />
          </div>
        )}

        <button type="submit" style={{backgroundColor:"black",color:"white"}} disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Package'}
        </button>
      </form>
    </div>
   </>
  );
};

export default AddPackage;
