import Razorpay from "razorpay";
import crypto from 'crypto';
import {Booking} from '../models/Booking.js';
import {Package} from '../models/Package.js';
import {User} from '../models/user.model.js';
import mongoose from 'mongoose';
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
});
// Create Razorpay order and capture payment
export const createPaymentOrder = async (req, res) => {
  const { userId, people } = req.body;
  const { packageId } = req.params;

  try {
    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const selectedPackage = await Package.findById(packageId);
    if (!selectedPackage) {
      return res.status(404).json({ message: 'Package not found' });
    }

    // Calculate total cost based on age
    let totalCost = 0;
    people.forEach((person) => {
      totalCost += person.age < 5 ? selectedPackage.totalPrice * 0.5 : selectedPackage.totalPrice;
    });

    // Create Razorpay order
    const paymentOrder = await razorpay.orders.create({
        amount: totalCost * 100,  // amount in smallest currency unit
        currency: "INR",
        receipt: `receipt_${Math.random()}`,
      });
  
      res.status(200).json({
        success: true,
        orderId: paymentOrder.id,
        amount: totalCost,
        currency: paymentOrder.currency,
      });
  } catch (error) {
    console.error('Error creating payment order:', error);
    res.status(500).json({ success: false, message: 'Payment initiation failed' });
  }
};

// Verify Razorpay payment signature and complete booking
export const confirmBooking = async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, name, mobileNumber, people, userId, packageId } = req.body;
  
      const user = await User.findById(userId);
      if (!user) return res.status(400).json({ message: 'Invalid user ID' });
  
      const selectedPackage = await Package.findById(packageId);
      if (!selectedPackage) return res.status(404).json({ message: 'Package not found' });
  
      // Verify payment signature (Razorpay or your payment provider's verification process)
      const isPaymentValid = verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature); // Custom function for payment verification
      if (!isPaymentValid) return res.status(400).json({ message: 'Invalid payment signature' });
  
      // Calculate total cost
      let totalCost = 0;
      people.forEach((person) => {
        totalCost += person.age < 5 ? selectedPackage.totalPrice * 0.5 : selectedPackage.totalPrice;
      });
  
      // Save booking
      const booking = new Booking({
        package: selectedPackage._id,
        name,
        mobileNumber,
        email: user.email,
        userId,
        people,
        totalCost,
      });
  
      await booking.save();
      res.status(201).json({ message: 'Booking confirmed', booking });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to confirm booking', error: error.message });
    }
  };
  