import mongoose from 'mongoose'

const userModel = new mongoose.Schema(
	{
		firstName: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		profilePhoto: {
			type: String,
			default: '',
		},
		gender: {
			type: String,
			enum: ['male', 'female'],
			required: true,
		},
	},
	{ timestamps: true },
)
export const User = mongoose.model('User', userModel)
