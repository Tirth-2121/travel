import express from "express";
import {
	createPlace,
	getPlaces,
	updatePlace,
	deletePlace,
	createHotel,
	getHotel,
	updateHotel,
	deleteHotel,
	addTransport,
	getTransports,
	updateTransport,
	deleteTransport,
	createPackage,
	getPackages,
	getPackage,
	updatePackage,
	deletePackage,
	applyPackage,
	getAllBookings,
	getUserBookings,
	getAllUserPackage,
	verifyPayment,
} from "../controllers/adminController.js";
// import {
// 	createDestination,
// 	getDestination,
// 	updateDestination,
// 	deleteDestination,
// 	createSource,
// 	getSource,
// 	updateSource,
// 	deleteSource,
// 	createHotel,
// 	getHotel,
// 	updateHotel,
// 	deleteHotel,
// 	addTransport,
// 	getTransports,
// 	updateTransport,
// 	deleteTransport,
// 	createPackage,
// 	getPackages,
// 	getPackage,
// 	updatePackage,
// 	deletePackage,
// 	applyPackage,
// 	getAllBookings,
// 	getUserBookings,
// 	getAllUserPackage,
// 	verifyPayment,
// } from "../controllers/adminController.js";
import { confirmBooking, createPaymentOrder } from "../controllers/Payments.js";
import { verifyAdmin, verifyToken } from "../middleware/verifyToken.js";
const router = express.Router();

// Destination routes
router.post('/places',verifyToken, verifyAdmin, createPlace);
router.get('/places', verifyToken, getPlaces);
router.put('/places/:id',verifyToken, verifyAdmin, updatePlace); // Update destination
router.delete('/places/:id',verifyToken, verifyAdmin, deletePlace); // Delete destination

// Source routes
// router.post('/sources',verifyToken, verifyAdmin, createSource);
// router.get('/sources',verifyToken, getSource);
// router.put('/sources/:id',verifyToken, verifyAdmin, updateSource); // Update source
// router.delete('/sources/:id',verifyToken, verifyAdmin, deleteSource); // Delete source

// Hotel routes
router.post('/hotels',verifyToken, verifyAdmin, createHotel);
router.get('/hotels',verifyToken, getHotel);
router.put('/hotels/:id',verifyToken, verifyAdmin, updateHotel); // Update hotel
router.delete('/hotels/:id',verifyToken, verifyAdmin, deleteHotel); // Delete hotel

// Transport routes
router.post('/transports',verifyToken, verifyAdmin, addTransport);
router.get('/transports',verifyToken, getTransports);
router.put('/transports/:id',verifyToken, verifyAdmin, updateTransport); // Update transport
router.delete('/transports/:id', verifyToken, verifyAdmin,deleteTransport); // Delete transport

// Package routes
router.post('/packages',verifyToken, verifyAdmin, createPackage);
router.get('/packages',verifyToken, getPackages);
router.get('/packages/:id',verifyToken, getPackage);
router.put('/packages/:id',verifyToken, verifyAdmin, updatePackage);
router.delete('/packages/:id',verifyToken, verifyAdmin, deletePackage);


router.post('/packages/:packageId/apply',verifyToken, applyPackage);
router.get('/bookings',verifyToken, verifyAdmin, getAllBookings);
router.get('/user/:userId/bookings',verifyToken, getUserBookings);
router.get('/packages/:packageId/applied-users', verifyToken, verifyAdmin,getAllUserPackage)
// router.post('/packages/:packageId/pay', createPaymentOrder);
// router.post('/verify-payment', confirmBooking);
router.post('/payment/verify', verifyToken,verifyPayment);

export default router;
