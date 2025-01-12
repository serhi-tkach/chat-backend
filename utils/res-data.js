import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config({})

export const resData = user => {
	const tokenData = {
		userId: user._id,
	}

	const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
		expiresIn: '1d',
	})

	const cookieData = {
		maxAge: 1 * 24 * 60 * 60 * 1000,
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
	}

	const userData = {
		_id: user._id,
		firstName: user.firstName,
		lastName: user.lastName,
		profilePhoto: user.profilePhoto,
	}

	return { token, cookieData, userData }
}
