import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
	const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', ''); // Handle token in both cookies and headers
	if (!token) return res.status(401).json({ success: false, message: "Unauthorized - no token provided" });
	// console.log(token)
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		if (!decoded) return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });

		req.userId = decoded.id;  // Attach user ID from token payload
		req.role = decoded.role;  // Attach role from token payload
		console.log("role",req.role)
		next(); // Proceed to the next middleware or route handler
	} catch (error) {
		console.log("Error in verifyToken ", error);
		return res.status(500).json({ success: false, message: "Server error" });
	}
};

export const verifyAdmin = (req, res, next) => {
	// Use the already decoded token from verifyToken
	if (req.role !== 'admin') {
		return res.status(403).json({ success: false, message: "Access denied - Admins only" });
	}
	next(); // User is an admin, proceed to the next middleware or route handler
};