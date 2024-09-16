import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', required: true },
  name: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  email: { type: String, required: true }, // Email field
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // User ID field
  people: [
    {
      name: { type: String, required: true },
      age: { type: Number, required: true }
    }
  ],
  totalCost: { type: Number, required: true },
  razorpayOrderId: { type: String, required: true }, // Razorpay order ID field
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'completed', 'failed'], 
    default: 'pending' 
  }, // Payment status field
}, { timestamps: true });

export const Booking = mongoose.model('Booking', bookingSchema);
