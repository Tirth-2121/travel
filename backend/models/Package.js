import mongoose from "mongoose";

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  source: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true },
  destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true },
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
  transports: { type: mongoose.Schema.Types.ObjectId, ref: 'Transport' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  images: [
    {
      public_id: { type: String, required: true },  // Cloudinary public ID for each image
      url: { type: String, required: true },        // Cloudinary URL for each image
    },
  ],
  pdf: {
    public_id: { type: String, required: false },  // Cloudinary public ID for the PDF
    url: { type: String, required: false },        // Cloudinary URL for the PDF
  },
  basePrice: { type: Number, required: true },
  totalDistance: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  nights: { type: Number, required: true },
  description: { type: String, required: true }
});

export const Package = mongoose.model('Package', packageSchema);
