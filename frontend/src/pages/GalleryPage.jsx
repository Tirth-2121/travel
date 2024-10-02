import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Card, CardMedia, CardContent, Typography } from '@mui/material';
import NavbarUser from '../components/NavbarUser';

const GalleryPage = () => {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/gallery');
        setPhotos(response.data);
      } catch (err) {
        console.error('Failed to fetch photos', err);
      }
    };

    fetchPhotos();
  }, []); // Use an empty dependency array to run the effect only once

  return (
    <>
      <NavbarUser />
      <Container maxWidth="md">
        <Grid container spacing={3} sx={{ mt: 3 }}>
          {photos.map((photo) => (
            <Grid item xs={12} sm={6} md={4} key={photo._id}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={photo.image.url} // Use the correct path to the image URL
                  alt="Gallery Image"
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default GalleryPage;