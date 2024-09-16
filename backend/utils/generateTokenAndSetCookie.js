import jwt from 'jsonwebtoken';

// Function to generate token and set it in a cookie
export const generateTokenAndSetCookie = (res, userId, role) => {
    const token = jwt.sign({ id: userId, role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Set token as a cookie
    res.cookie('token', token, {
        httpOnly: true,   // Helps prevent XSS attacks
        secure: process.env.NODE_ENV === 'production', // Use secure cookie in production
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 day
    });

    // Also return the token
    return token;
};
