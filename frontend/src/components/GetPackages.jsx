import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavbarAdmin from './NavbarAdmin';

const PackageDataFetcher = () => {
  const token = localStorage.getItem('token');  // Retrieve token from localStorage
  const config = {
    headers: {
      Authorization: `Bearer ${token}` // Send token in Authorization header
    }
  };
  const [packages, setPackages] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchPackages = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await axios.get('http://localhost:5000/api/admin/packages',config); // Adjust the endpoint as needed
      setPackages(response.data);
    } catch (error) {
      setError('Failed to fetch packages');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
   <>
    <NavbarAdmin></NavbarAdmin>
    <div>
      <button onClick={() => navigate(-1)}>Back</button>
      <h2 style={{fontSize:"25px"}}>Package Data</h2>
      <button onClick={fetchPackages} style={{backgroundColor:"black",color:"white"}} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Get Packages'}
      </button>
      {error && <p className="error">{error}</p>}
      {packages.length > 0 && (
        <ul>
          {packages.map(pkg => (
            <li key={pkg._id}>
              <strong>Package Name:</strong> {pkg.name}<br />
              <strong>Source:</strong> {pkg.source.name}<br />
              <strong>Destination:</strong> {pkg.destination.name}<br />
              <strong>Hotel:</strong> {pkg.hotel.name}<br />
              <strong>Transport: </strong> 
                {pkg.transports ? (
                <span>
                    {pkg.transports.type} from {pkg.transports.from.name} to {pkg.transports.to.name} - ₹{pkg.transports.price}
                </span>
                    ) : (
                    'No transport available'
                    )}<br />
              <strong>Start Date:</strong> {new Date(pkg.startDate).toLocaleDateString()}<br />
              <strong>End Date:</strong> {new Date(pkg.endDate).toLocaleDateString()}<br />
              <strong>Total Price:</strong> ₹{pkg.totalPrice}<br />
              <strong>Total Distance:</strong> {pkg.totalDistance} km
            </li>
          ))}
        </ul>
      )}
    </div>
   </>
  );
};

export default PackageDataFetcher;