import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true }
});

export const Source = mongoose.model('Source', destinationSchema);