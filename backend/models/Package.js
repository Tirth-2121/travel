import mongoose from "mongoose";

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  source: { type: mongoose.Schema.Types.ObjectId, ref: 'Source', required: true },
  destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', required: true },
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  transports: { type: mongoose.Schema.Types.ObjectId, ref: 'Transport' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  image: {
    public_id: { type: String },  // Cloudinary public ID
    url: { type: String },        // Cloudinary URL
  },
  basePrice: { type: Number, required: true },
  totalDistance: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  nights: { type: Number, required: true },
  description: { type: String, required: true }
});

export const Package = mongoose.model('Package', packageSchema);
