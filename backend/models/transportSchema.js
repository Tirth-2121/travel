import mongoose from "mongoose";

const transportSchema = new mongoose.Schema({
    type: { type: String, enum: ['train', 'bus', 'AeroPlane'], required: true },
    from: { type: mongoose.Schema.Types.ObjectId, ref: 'Source', required: true },
    to: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', required: true },
    price: { type: Number, required: true }
  });

  export const Transport = mongoose.model('Transport', transportSchema);