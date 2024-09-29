import mongoose from "mongoose";

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String }
});

export const Place = mongoose.model('Place', placeSchema);