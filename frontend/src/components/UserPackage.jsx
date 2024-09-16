import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import NavbarAdmin from './NavbarAdmin';

const UserPackage = () => {
    const token = localStorage.getItem('token');  // Retrieve token from localStorage
    const config = {
      headers: {
        Authorization: `Bearer ${token}` // Send token in Authorization header
      }
    };
    const { packageId } = useParams();
    const [packageDetails, setPackageDetails] = useState(null);
    const [appliedUsers, setAppliedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPackageDetails = async () => {
            try {
                // Fetch package details
                const response = await axios.get(`http://localhost:5000/api/admin/packages/${packageId}`,config);
                setPackageDetails(response.data);
                
                // Fetch applied users separately
                const usersResponse = await axios.get(`http://localhost:5000/api/admin/packages/${packageId}/applied-users`,config);
                setAppliedUsers(usersResponse.data);
                
                setLoading(false);
            } catch (error) {
                setError('An error occurred while fetching package details.');
                setLoading(false);
            }
        };

        fetchPackageDetails();
    }, [packageId]);

    const handleCallUser = (mobileNumber) => {
        alert(`Calling ${mobileNumber}...`); // Replace with actual call functionality
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!packageDetails) return <div>No package details available.</div>;

    return (
        <>
            <NavbarAdmin />
            <div style={styles.container}>
                <div style={styles.packageDetails}>
                    <h2 style={styles.font_head}>Package Details</h2>
                    <h3 style={styles.font_head1}>{packageDetails.name}</h3>
                </div>
                <div style={styles.userContainer}>
                    <strong>Applied Users</strong>
                    {appliedUsers.length === 0 ? (
                        <p>No users have applied for this package.</p>
                    ) : (
                        <ul style={styles.userList}>
                            {appliedUsers.map((user, index) => (
                                <li key={user._id} style={styles.userItem}>
                                    <div><strong>User {index + 1}:</strong></div>
                                    <div><strong>Name:</strong> {user.name}</div>
                                    <div><strong>Mobile Number:</strong> {user.mobileNumber}</div>
                                    <div><strong>Age(s):</strong> {user.age}</div>
                                    <div><strong>Email:</strong> {user.email}</div>
                                    <div><strong>Payment Status:</strong> {user.paymentStatus}</div>
                                    {user.paymentStatus === 'failed' || user.paymentStatus === 'pending' ? (
                                        <button 
                                            style={styles.callButton}
                                            onClick={() => handleCallUser(user.mobileNumber)}
                                        >
                                            Call User
                                        </button>
                                    ) : null}
                                    <hr />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
};

const styles = {
    container: {
        padding: '20px',
    },
    font_head: {
        fontSize: '25px',
        fontWeight: 'Bold'
    },
    font_head1: {
        fontSize: '19px',
    },
    packageDetails: {
        marginBottom: '20px',
    },
    image: {
        width: '100%',
        height: 'auto',
        objectFit: 'cover',
        borderRadius: '8px',
        marginBottom: '10px',
    },
    userContainer: {
        marginTop: '20px',
    },
    userList: {
        listStyleType: 'none',
        padding: 0,
    },
    userItem: {
        marginBottom: '10px',
    },
    callButton: {
        marginTop: '10px',
        padding: '10px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
};

export default UserPackage;
