import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  place: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true },
  pricePerNight: { type: Number, required: true },
});

export const Hotel = mongoose.model('Hotel', hotelSchema);