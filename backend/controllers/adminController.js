import {Hotel} from '../models/Hotel.js';
import {Transport} from '../models/transportSchema.js';
import {Package} from '../models/Package.js';
import {Booking} from "../models/Booking.js"
import cloudinary from '../config/cloudinaryConfig.js';
import { User } from '../models/user.model.js';
import {Place} from '../models/Place.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { sendContactUsEmail, sendPaymentConfirmationEmail, sendReplyEmail } from '../mailtrap/emails.js';
import { Photo } from '../models/Photo.js';
import { Contact } from '../models/Contact.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

export const createPlace = async (req, res) => {
  try {
    const place = new Place(req.body);
    console.log(place)
    await place.save();
    res.status(201).json(place);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Update Destination
export const updatePlace = async (req, res) => {
  try {
    const { name, description } = req.body;
    const place = await Place.findByIdAndUpdate(req.params.id, { name, description }, { new: true });
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }
    res.status(200).json(place);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update Source
// export const updateSource = async (req, res) => {
//   try {
//     const { name } = req.body;
//     const source = await Source.findByIdAndUpdate(req.params.id, { name }, { new: true });
//     if (!source) {
//       return res.status(404).json({ message: 'Source not found' });
//     }
//     res.status(200).json(source);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };
// Update Hotel
export const updateHotel = async (req, res) => {
  const { id } = req.params;
  const { name, pricePerNight, destination } = req.body;
  const place = destination 
  try {
    const updatedHotel = await Hotel.findByIdAndUpdate(id, {
      name,
      pricePerNight,
      place // Update destination here
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
    if(from === to){
      return res.status(400).json({ message: "Source and destination cannot be the same" });
    }
    const transport = await Transport.findByIdAndUpdate(req.params.id, { type, from, to, price }, { new: true });
    if (!transport) {
      return res.status(404).json({ message: 'Transport not found' });
    }
    res.status(200).json(transport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Place
export const deletePlace = async (req, res) => {
  try {
    const place = await Place.findByIdAndDelete(req.params.id);
    if (!place) {
      return res.status(404).json({ message: 'Place not found' });
    }
    res.status(200).json({ message: 'Place deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete Source
// export const deleteSource = async (req, res) => {
//   try {
//     const source = await Source.findByIdAndDelete(req.params.id);
//     if (!source) {
//       return res.status(404).json({ message: 'Source not found' });
//     }
//     res.status(200).json({ message: 'Source deleted successfully' });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

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
// export const createSource = async (req, res) => {
//   try {
//     const source = new Source(req.body);
//     console.log(source)
//     await source.save();
//     res.status(201).json(source);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// export const getSource = async (req, res) => {
//   try {
//     const source = await Source.find();
//     res.status(200).send(source);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

export const getPlaces = async (req, res) => {
  try {
    const places = await Place.find();
    res.status(200).send(places);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createHotel = async (req, res) => {
  try {
    const { name, pricePerNight, destination } = req.body;
  const place = destination 
  const hotel = new Hotel({name , pricePerNight , place});
    await hotel.save();
    res.status(201).json(hotel);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getHotel = async (req, res) => {
  try {
    const hotels = await Hotel.find().populate('place'); // Populate the destination field
    res.status(200).send(hotels);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const addTransport = async (req, res) => {
    try {
      const { type, from, to, price } = req.body;
      // console.log(req.body)
      if(from === to){
        return res.status(400).json({ message: "Source and destination cannot be the same" });
      }
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
        images, // Add the image field
        description ,
        pdf, // Add the pdf field
      } = req.body;
      console.log(req.body);
  
      // Fetch related entities
      const source = await Place.findById(sourceId);
      const destination = await Place.findById(destinationId);
      const hotel = await Hotel.findById(hotelId);
      const transports = await Transport.findById(transportId);
  if(sourceId === destinationId){
    return res.status(400).json({ message: "Source and destination cannot be the same" });
  }
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
  
      // Validate images: ensure minimum 1 and maximum 5 images
    if (!images || images.length < 1 || images.length > 5) {
      return res.status(400).json({ message: "You must upload at least 1 image and a maximum of 5 images." });
    }
      // Upload images to Cloudinary and collect the results
    const imageResults = [];
    for (const image of images) {
      const imageResult = await cloudinary.uploader.upload(image, {
        folder: 'packages', // Specify a folder in Cloudinary for packages
      });
      imageResults.push({
        public_id: imageResult.public_id,
        url: imageResult.secure_url,
      });
    }

    // Upload PDF to Cloudinary
    let pdfResult = null;
    if (pdf) {
      pdfResult = await cloudinary.uploader.upload(pdf, {
        folder: 'packages', // Specify a folder in Cloudinary for packages
        resource_type: 'raw' // Specify the resource type as raw for PDFs
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
        images: imageResults,
        pdf: pdfResult ? { public_id: pdfResult.public_id, url: pdfResult.secure_url } : null
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
        newImages, // Array of image URLs or Base64 strings for new images
        imagesToRemove, // Array of public IDs of images to remove
        description,
        pdf, // New PDF to upload
      } = req.body;
  
      // Find the package by ID
      const pkg = await Package.findById(req.params.id);
      if (!pkg) {
        return res.status(404).json({ message: 'Package not found' });
      }
      if(sourceId === destinationId){
        return res.status(400).json({ message: "Source and destination cannot be the same" });
      }
      // Update package fields only if provided, otherwise retain existing values
      if (name) pkg.name = name;
      if (sourceId) {
        const source = await Place.findById(sourceId);
        if (!source) throw new Error('Source not found');
        pkg.source = source;
      }
      if (destinationId) {
        const destination = await Place.findById(destinationId);
        if (!destination) throw new Error('Destination not found');
        pkg.destination = destination;
      }
      if (hotelId) {
        const hotel = await Hotel.findById(hotelId);
        if (!hotel) throw new Error('Hotel not found');
        pkg.hotel = hotel;
      }
      if (transportId) {
        const transport = await Transport.findById(transportId);
        if (!transport) throw new Error('Transport not found');
        pkg.transports = transport;
      }
      if (startDate) pkg.startDate = new Date(startDate);
      if (endDate) pkg.endDate = new Date(endDate);
      if (basePrice) pkg.basePrice = basePrice;
      if (totalDistance) pkg.totalDistance = totalDistance;
      if (description) pkg.description = description;
  
      // Handle removing images from Cloudinary
      if (imagesToRemove && imagesToRemove.length > 0) {
        for (const publicId of imagesToRemove) {
          const imageIndex = pkg.images.findIndex(img => img.public_id === publicId);
          if (imageIndex !== -1) {
            // Remove from local array and Cloudinary
            pkg.images.splice(imageIndex, 1);
            await cloudinary.uploader.destroy(publicId);
          }
        }
      }
  
      // Validate the number of images
      const totalImages = pkg.images.length + (newImages ? newImages.length : 0) - (imagesToRemove ? imagesToRemove.length : 0);
      if (totalImages == 0) {
        return res.status(400).json({ message: 'A package must have at least one image.' });
      }
      if (totalImages > 5) {
        return res.status(400).json({ message: 'A package can have a maximum of 5 images.' });
      }
  
      // Handle uploading new images to Cloudinary
      if (newImages && newImages.length > 0) {
        const imageResults = [];
        for (const image of newImages) {
          const uploadResponse = await cloudinary.uploader.upload(image, {
            folder: 'packages', // Optional: specify a folder
          });
          imageResults.push({
            url: uploadResponse.secure_url,
            public_id: uploadResponse.public_id
          });
        }
        // Append new images to the package's existing images
        pkg.images = [...pkg.images, ...imageResults];
      }
  
      // Handle uploading new PDF to Cloudinary
    if (pdf) {
      // Remove the existing PDF from Cloudinary if it exists
      if (pkg.pdf && pkg.pdf.public_id) {
        await cloudinary.uploader.destroy(pkg.pdf.public_id, { resource_type: 'raw' });
      }
      // Upload the new PDF
      const pdfResult = await cloudinary.uploader.upload(pdf, {
        folder: 'packages', // Specify a folder in Cloudinary for packages
        resource_type: 'raw' // Specify the resource type as raw for PDFs
      });
      pkg.pdf = { public_id: pdfResult.public_id, url: pdfResult.secure_url };
    }

      // Calculate the number of nights (ensure dates are valid)
      if (pkg.startDate && pkg.endDate && pkg.startDate <= pkg.endDate) {
        const start = new Date(pkg.startDate);
        const end = new Date(pkg.endDate);
        const nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  
        // Recalculate total price
        const hotelPrice = Number(pkg.hotel.pricePerNight) * nights;
        const transportPrice = Number(pkg.transports.price);
        pkg.totalPrice = (transportPrice * 2) + hotelPrice + Number(pkg.basePrice);
      } else {
        throw new Error('Invalid start date or end date.');
      }
  
      // Check if totalPrice calculation is valid
      if (isNaN(pkg.totalPrice)) {
        throw new Error('Invalid total price calculation.');
      }
  
      // Save updated package
      await pkg.save();
  
      // Populate the updated package with related fields
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
    if (pkg.images && pkg.images.public_id) {
      // Ensure the public_id is correct
      console.log('Deleting image with public_id:', pkg.images.public_id);
      await cloudinary.uploader.destroy(pkg.images.public_id, (result) => {
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
  

  //favorite packages
export const addToFavorites = async (req, res) => {
  const { userId, packageId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.favorites.includes(packageId)) {
      user.favorites.push(packageId);
      await user.save();
    }

    res.status(200).json({ message: 'Package added to favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getFavorites = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate({
      path: 'favorites',
      populate: [
        { path: 'source', select: 'name' },      // Populate the 'source' field and select the 'name' field
        { path: 'destination', select: 'name' }  // Populate the 'destination' field and select the 'name' field
      ]
    });    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const removeFromFavorites = async (req, res) => {
  const { userId, packageId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.favorites = user.favorites.filter(fav => fav.toString() !== packageId);
    await user.save();

    res.status(200).json({ message: 'Package removed from favorites' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

//gallery
export const addPhoto = async (req, res) => {
  const {image} = req.body;
  // console.log(req.body)
  try {
    if (!image) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const imageResult = await cloudinary.uploader.upload(image, {
      folder: 'packages', // Specify a folder in Cloudinary for packages
    });
  
    // Create a new photo with the uploaded image details
    const photo = new Photo({
      image: imageResult
          ? { public_id: imageResult.public_id, url: imageResult.secure_url }
          : null, // Store Cloudinary image details, if available
    });
    const savedPhoto = await photo.save();
    res.status(201).json(savedPhoto);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const removePhoto = async (req, res) => {
  try {
    const photo = await Photo.findByIdAndDelete(req.params.id);
    console.log(photo)
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }

    // Delete image from Cloudinary
    await cloudinary.uploader.destroy(photo.image.public_id);
    res.status(200).json({ message: 'Photo removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getPhotos = async (req, res) => {
  try {
    const photos = await Photo.find();
    res.status(200).json(photos);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


// contact us

export const createContact = async (req, res) => {
  try {
    const { name, email, description } = req.body;
    const userId = req.user ? req.user._id : null; // Check if user is logged in

    const contact = new Contact({
      name,
      email,
      description,
      user: userId
    });

    await contact.save();
    await sendContactUsEmail(email, name);
    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().populate('user', 'name email');
    res.status(200).json(contacts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    await Contact.findByIdAndDelete(id);
    res.status(200).json({ message: 'Contact message deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const sendReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { subject, message } = req.body;

    // Find the contact message by ID
    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact message not found' });
    }
    console.log(contact)
    // Send the reply email
    await sendReplyEmail(contact.email, subject, message);

    // Update the status to completed
    contact.status = 'completed';
    await contact.save();

    res.status(200).json({ message: 'Reply sent successfully and status updated to completed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
