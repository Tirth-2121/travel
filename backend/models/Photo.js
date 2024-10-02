import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema({
  image: {
    public_id: { type: String ,required: true },  // Cloudinary public ID
    url: { type: String ,required: true },        // Cloudinary URL
    createdAt: { type: Date, default: Date.now }
  },
});

export const Photo = mongoose.model('Photo', photoSchema);