import {Destination} from '../models/Destination.js';
import {Hotel} from '../models/Hotel.js';
import {Transport} from '../models/transportSchema.js';
import {Package} from '../models/Package.js';
import {Source} from '../models/Source.js';
import {Booking} from "../models/Booking.js"
import cloudinary from '../config/cloudinaryConfig.js';
import { User } from '../models/user.model.js';

import Razorpay from 'razorpay';
import crypto from 'crypto';
import { sendPaymentConfirmationEmail } from '../mailtrap/emails.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

export const createDestination = async (req, res) => {
  try {
    const destination = new Destination(req.body);
    console.log(destination)
    await destination.save();
    res.status(201).json(destination);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Update Destination
export const updateDestination = async (req, res) => {
  try {
    const { name, description } = req.body;
    const destination = await Destination.findByIdAndUpdate(req.params.id, { name, description }, { new: true });
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    res.status(200).json(destination);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update Source
export const updateSource = async (req, res) => {
  try {
    const { name } = req.body;
    const source = await Source.findByIdAndUpdate(req.params.id, { name }, { new: true });
    if (!source) {
      return res.status(404).json({ message: 'Source not found' });
    }
    res.status(200).json(source);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Update Hotel
export const updateHotel = async (req, res) => {
  const { id } = req.params;
  const { name, pricePerNight, destination } = req.body;
  
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(id, {
      name,
      pricePerNight,
      destination // Update destination here
    }, { new: true });

    res.status(200).json(updatedHotel);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Update Transport
export const updateTransport = async (req, res) => {
  try {
    const { type, from, to, price } = req.body;
    const transport = await Transport.findByIdAndUpdate(req.params.id, { type, from, to, price }, { new: true });
    if (!transport) {
      return res.status(404).json({ message: 'Transport not found' });
    }
    res.status(200).json(transport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Destination
export const deleteDestination = async (req, res) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    res.status(200).json({ message: 'Destination deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Source
export const deleteSource = async (req, res) => {
  try {
    const source = await Source.findByIdAndDelete(req.params.id);
    if (!source) {
      return res.status(404).json({ message: 'Source not found' });
    }
    res.status(200).json({ message: 'Source deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Hotel
export const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }
    res.status(200).json({ message: 'Hotel deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Transport
export const deleteTransport = async (req, res) => {
  try {
    const transport = await Transport.findByIdAndDelete(req.params.id);
    if (!transport) {
      return res.status(404).json({ message: 'Transport not found' });
    }
    res.status(200).json({ message: 'Transport deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const createSource = async (req, res) => {
  try {
    const source = new Source(req.body);
    console.log(source)
    await source.save();
    res.status(201).json(source);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getSource = async (req, res) => {
  try {
    const source = await Source.find();
    res.status(200).send(source);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getDestination = async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.status(200).send(destinations);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createHotel = async (req, res) => {
  try {
    const hotel = new Hotel(req.body);
    await hotel.save();
    res.status(201).json(hotel);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getHotel = async (req, res) => {
  try {
    const hotels = await Hotel.find().populate('destination'); // Populate the destination field
    res.status(200).send(hotels);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addTransport = async (req, res) => {
    try {
      const { type, from, to, price } = req.body;
      const transport = new Transport({ type, from, to, price });
      await transport.save();
      res.status(201).json(transport);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  export const getTransports = async (req, res) => {
    try {
      const transports = await Transport.find()
      .populate('from', 'name')
      .populate('to', 'name'); 
      console.log(transports);
      res.status(200).json(transports);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  export const createPackage = async (req, res) => {
    try {
      const {
        name,
        sourceId,
        destinationId,
        hotelId,
        transportId,
        startDate,
        endDate,
        basePrice,
        totalDistance,
        image, // Add the image field
        description 
      } = req.body;
  
      console.log(req.body);
  
      // Fetch related entities
      const source = await Source.findById(sourceId);
      const destination = await Destination.findById(destinationId);
      const hotel = await Hotel.findById(hotelId);
      const transports = await Transport.findById(transportId);
  
      const start = new Date(startDate);
      const end = new Date(endDate);
      const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  
      const hotelPricePerNight = Number(hotel.pricePerNight);
      const transportPrice = Number(transports.price);
      const basePriceNum = Number(basePrice);
      const hotelPrice = hotelPricePerNight * nights;
      const transportPrices = transportPrice * 2;
  
      const totalPrice = basePriceNum + transportPrices + hotelPrice;
  
      console.log(totalPrice);
  
      // Upload image to Cloudinary if provided
      let imageResult;
      if (image) {
        imageResult = await cloudinary.uploader.upload(image, {
          folder: 'packages', // Specify a folder in Cloudinary for packages
        });
      }
  
      // Create a new package with the uploaded image
      const packages = new Package({
        name,
        source,
        destination,
        hotel,
        transports,
        startDate,
        endDate,
        basePrice,
        totalDistance,
        totalPrice,
        nights,
        description ,
        image: imageResult
          ? { public_id: imageResult.public_id, url: imageResult.secure_url }
          : null, // Store Cloudinary image details, if available
      });
  
      await packages.save();
  
      // Populate the saved package with related data
      const populatedPackage = await Package.findById(packages._id)
        .populate('source')
        .populate('destination')
        .populate('hotel')
        .populate('transports');
  
      res.status(201).json(populatedPackage);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  export const updatePackage = async (req, res) => {
    try {
        const {
            name,
            sourceId,
            destinationId,
            hotelId,
            transportId,
            startDate,
            endDate,
            basePrice,
            totalDistance,
            image, // New image URL or Base64 string
            description 
        } = req.body;

        // Find the package by ID
        const pkg = await Package.findById(req.params.id);
        if (!pkg) {
            return res.status(404).json({ message: 'Package not found' });
        }

        // Update package fields
        pkg.name = name || pkg.name;
        pkg.source = await Source.findById(sourceId) || pkg.source;
        pkg.destination = await Destination.findById(destinationId) || pkg.destination;
        pkg.hotel = await Hotel.findById(hotelId) || pkg.hotel;
        pkg.transports = await Transport.findById(transportId) || pkg.transports;
        pkg.startDate = startDate || pkg.startDate;
        pkg.endDate = endDate || pkg.endDate;
        pkg.basePrice = basePrice || pkg.basePrice;
        pkg.totalDistance = totalDistance || pkg.totalDistance;
        pkg.description  = description || pkg.description ;
        // Handle image update
        if (image) {
            // Optionally, delete the old image if it exists
            if (pkg.image && pkg.image.public_id) {
                await cloudinary.uploader.destroy(pkg.image.public_id);
            }

            // Upload the new image
            const uploadResponse = await cloudinary.uploader.upload(image, {
                folder: 'packages' // Optional: specify a folder
            });

            // Update package with the new image URL and public ID
            pkg.image = {
                url: uploadResponse.secure_url,
                public_id: uploadResponse.public_id
            };
        }

        // Calculate number of nights
        const start = new Date(pkg.startDate);
        const end = new Date(pkg.endDate);
        const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

        // Calculate total price
        const hotelPrice = Number(pkg.hotel.pricePerNight) * nights; // Total hotel cost for the nights
        const transportPrice = Number(pkg.transports.price); // Single transport price
        pkg.totalPrice = (transportPrice * 2) + hotelPrice + Number(pkg.basePrice); // Total price calculation

        // Ensure totalPrice is a valid number
        if (isNaN(pkg.totalPrice)) {
            throw new Error('Invalid totalPrice calculation');
        }

        await pkg.save();

        // Populate the updated package with related data
        const populatedPackage = await Package.findById(pkg._id)
            .populate('source')
            .populate('destination')
            .populate('hotel')
            .populate('transports');

        res.status(200).json(populatedPackage);
    } catch (error) {
        console.error('Error updating package:', error);
        res.status(400).json({ message: error.message });
    }
};
 export const deletePackage = async (req, res) => {
  try {
    const packageId = req.params.id;
    
    // Find the package to delete
    const pkg = await Package.findById(packageId);
    if (!pkg) return res.status(404).send('Package not found');
    
    // Delete the image from Cloudinary if it exists
    if (pkg.image && pkg.image.public_id) {
      // Ensure the public_id is correct
      console.log('Deleting image with public_id:', pkg.image.public_id);
      await cloudinary.uploader.destroy(pkg.image.public_id, (result) => {
        if (result.result === 'ok') {
          console.log('Image deleted successfully');
        } else {
          console.error('Failed to delete image:', result);
        }
      });
    }
    
    // Delete the package
    await Package.findByIdAndDelete(packageId);
    
    res.status(200).send('Package deleted successfully');
  } catch (error) {
    console.error('Error deleting package:', error);
    res.status(500).send('Server error');
  }
};
  export const getPackages = async (req, res) => {
    try {
      const packages = await Package.find()
        .populate('destination')
        .populate('source')
        .populate('hotel')
        .populate({
          path: 'transports',
          populate: [
            { path: 'from', select: 'name' }, // Populate the 'from' field
            { path: 'to', select: 'name' }      // Populate the 'to' field
          ]
        });
      res.status(200).json(packages);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  
  export const getPackage = async (req, res) => {
    try {
      const packages = await Package.findById(req.params.id)
        .populate('destination')
        .populate('source')
        .populate('hotel')
        .populate('transports');
      if (!packages) {
        return res.status(404).json({ message: 'Package not found' });
      }
      res.status(200).json(packages);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };


  // apply package

  export const applyPackage1 = async (req, res) => {
    try {
      const { name, mobileNumber, userId, people } = req.body;
      const { packageId } = req.params;
  
      // Check if user exists
      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
  
      const email = user.email;
  
      // Validate input data
      if (!name || !mobileNumber || !Array.isArray(people)) {
        return res.status(400).json({ message: 'Invalid input data' });
      }
  
      // Find the package by ID
      const selectedPackage = await Package.findById(packageId);
      if (!selectedPackage) {
        return res.status(404).json({ message: 'Package not found' });
      }
  
      // Calculate total cost based on age
      let totalCost = 0;
      people.forEach((person) => {
        totalCost += person.age < 5 ? selectedPackage.totalPrice * 0.5 : selectedPackage.totalPrice;
      });
  
      // Save booking with pending payment status
      const booking = new Booking({
        package: selectedPackage._id,
        name,
        mobileNumber,
        email,
        userId,
        people,
        totalCost,
      });
  
      await booking.save();
      res.status(201).json({ message: 'Package applied successfully', booking });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to apply package', error: error.message });
    }
  };
  

  export const getAllBookings = async (req, res) => {
    try {
      const bookings = await Booking.find().populate('package'); // Populate package details
      res.status(200).json(bookings);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  export const getUserBookings = async (req, res) => {
    try {
      const userId = req.params.userId;
      
      // Populate the 'package' field and then further populate 'source' and 'destination'
      const bookings = await Booking.find({ userId , paymentStatus: 'completed' })
        .populate({
          path: 'package',
          populate: [
            { path: 'source', select: 'name' },      // Assuming 'name' is the field you want to show
            { path: 'destination', select: 'name' }  // Assuming 'name' is the field you want to show
          ]
        });
  
      // Map through the bookings to calculate the number of nights
      const bookingsWithNights = bookings.map(booking => {
        const startDate = new Date(booking.package.startDate);
        const endDate = new Date(booking.package.endDate);
        const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)); // Calculate nights
        return {
          ...booking.toObject(), // Convert the Mongoose document to a plain object
          package: {
            ...booking.package.toObject(),
            nights, // Add the nights field to the package
          }
        };
      });
  
      res.status(200).json(bookingsWithNights);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch bookings', error: error.message });
    }
  };
  
  export const getAllUserPackage = async (req, res) => {
    const { packageId } = req.params;

  try {
    // Fetch all bookings for the given package
    const bookings = await Booking.find({ package: packageId }).populate('userId', 'name mobileNumber email');
    
    // Extract applied users from bookings
    const appliedUsers = bookings.map(booking => ({
      _id: booking.userId._id,
      name: booking.userId.name,
      mobileNumber: booking.mobileNumber,
      age: booking.people.map(person => person.age).join(', '), // Combine ages if multiple people
      email: booking.userId.email,
      paymentStatus: booking.paymentStatus // Include payment status
    }));

    res.json(appliedUsers);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching applied users.' });
  }
  };



  // payment and booking
  export const applyPackage = async (req, res) => {
    try {
      const { name, mobileNumber, userId, people, totalCost } = req.body;
      const { packageId } = req.params;
      // Find the package
      const selectedPackage = await Package.findById(packageId);
      if (!selectedPackage) {
        return res.status(404).json({ message: 'Package not found' });
      }
   // Check if user exists
   const user = await User.findById(userId);
   if (!user) {
     return res.status(400).json({ message: 'Invalid user ID' });
   }

   const email = user.email;
      // Create a Razorpay order
      const razorpayOrder = await razorpay.orders.create({
        amount: totalCost * 100, // Convert to paise
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
      });
  // console.log(razorpayOrder)
      // Save booking with pending payment status
      const booking = new Booking({
        package: selectedPackage._id,
        name,
        mobileNumber,
        email,
        userId,
        people,
        totalCost,
        razorpayOrderId: razorpayOrder.id,
      });
      console.log(booking)
      await booking.save();
      res.status(201).json({ message: 'Package applied successfully', orderId: razorpayOrder.id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to apply package', error: error.message });
    }
  };
  
  // Webhook to verify payment
  export const verifyPayment = async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
   // Ensure all required fields are present
   if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ message: 'Missing required fields' });
}
      const secret = process.env.RAZORPAY_SECRET;
      const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');
  
      if (generatedSignature === razorpay_signature) {
        const booking = await Booking.findOne({ razorpayOrderId: razorpay_order_id }).populate('package');
if (booking) {
  booking.paymentStatus = 'completed'; // Update payment status to 'completed'
  await booking.save();
  await sendPaymentConfirmationEmail(booking.email, booking.package.name, booking.totalCost);
}
        res.status(200).json({ message: 'Payment verification successful' });
      } else {
        res.status(400).json({ message: 'Payment verification failed' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Failed to verify payment', error: error.message });
    }
  };
  