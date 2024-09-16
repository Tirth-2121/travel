import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavbarAdmin from './NavbarAdmin';

const AppliedPackage = () => {
  const token = localStorage.getItem('token');  // Retrieve token from localStorage
  const config = {
    headers: {
      Authorization: `Bearer ${token}` // Send token in Authorization header
    }
  };
  const [packages, setPackages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/packages',config);
        setPackages(response.data);
      } catch (error) {
        console.error('Error fetching packages:', error);
      }
    };

    fetchPackages();
  }, []);

  const handlePackageClick = (packageId) => {
    navigate(`/${packageId}`);
  };

  return (
    <>
        <NavbarAdmin></NavbarAdmin>
        <div style={styles.container}>
      <h1 style={styles.head}>All Packages</h1>
      <ul style={styles.packageList}>
        {packages.map((pkg, index) => (
          <li key={pkg._id} style={styles.packageItem}>
            <button onClick={() => handlePackageClick(pkg._id)} style={styles.packageButton}>
              {index + 1}. {pkg.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
    </>
   
  );
};

const styles = {
    head:{
        fontSize:'28px',
        fontWeight:"bold",
        marginBottom:"10px"
    },
  container: {
    padding: '20px',
  },
  packageList: {
    listStyleType: 'none',
    padding: 0,
  },
  packageItem: {
    marginBottom: '10px',
  },
  packageButton: {
    padding: '10px',
    fontSize: '16px',
    cursor: 'pointer',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: '#007BFF',
    color: 'white',
    width: '100%',
    textAlign: 'left',
  },
};

export default AppliedPackage;
