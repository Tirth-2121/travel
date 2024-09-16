import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
});

export const Destination= mongoose.model('Destination', destinationSchema);