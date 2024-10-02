import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		lastLogin: {
			type: Date,
			default: Date.now,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Package' }],
		resetPasswordToken: String,
		resetPasswordExpiresAt: Date,
		verificationToken: String,
		verificationTokenExpiresAt: Date,

		 // Add role field with a default value of 'user'
		 role: {
			type: String,
			enum: ['user', 'admin'], // Only allow 'user' or 'admin' roles
			default: 'user', // Default role is 'user'
		  },
	},
	{ timestamps: true }
);

export const User = mongoose.model("User", userSchema);
