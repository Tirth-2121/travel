import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', required: true },
  pricePerNight: { type: Number, required: true },
});

export const Hotel = mongoose.model('Hotel', hotelSchema);