import { hash, verify } from 'argon2'
import { User } from '../models/user.model.js'
import { resData } from '../utils/res-data.js'
import { io } from '../index.js'
import { userSocketMap } from '../socket/socket.js'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
	try {
		const { firstName, lastName, email, password, gender } = req.body
		if (!firstName || !lastName || !email || !password || !gender) {
			return res.status(400).json({ message: 'All fields are required' })
		}

		const user = await User.findOne({ email })
		if (user) {
			return res.status(400).json({ message: 'Email already taken' })
		}
		const hashedPassword = await hash(password)

		const maleProfilePhoto = `https://avatar.iran.liara.run/public/boy?username=${email}`
		const femaleProfilePhoto = `https://avatar.iran.liara.run/public/girl?username=${email}`

		const newUser = await User.create({
			firstName,
			lastName,
			email,
			password: hashedPassword,
			gender,
			profilePhoto: gender === 'male' ? maleProfilePhoto : femaleProfilePhoto,
		})
		return res
			.status(201)
			.cookie('token', resData(newUser).token, resData(newUser).cookieData)
			.json(resData(newUser).userData)
	} catch (error) {
		console.log(error)
	}
}

export const login = async (req, res) => {
	try {
		const { email, password } = req.body
		if (!email || !password) {
			return res.status(400).json({ message: 'All fields are required' })
		}
		const user = await User.findOne({ email })
		if (!user) {
			return res.status(400).json({
				message: 'Incorrect email or password',
				success: false,
			})
		}
		const isPasswordMatch = await verify(user.password, password)
		if (!isPasswordMatch) {
			return res.status(400).json({
				message: 'Incorrect email or password',
				success: false,
			})
		}
		return res
			.status(200)
			.cookie('token', resData(user).token, resData(user).cookieData)
			.json(resData(user).userData)
	} catch (error) {
		console.log(error)
	}
}

export const logout = (req, res, next) => {
	try {
		// req.logout()
		req.logout(err => {
			if (err) return next(err)
		})

		return res
			.status(200)
			.cookie('token', '', 'connect.sid', '', { maxAge: 0 })
			.json({
				// message: 'Logged out successfully',
				success: true,
			})
	} catch (error) {
		console.log(error)
	}
}

export const checkAuth = async (req, res) => {
	try {
		const token = req.cookies.token
		if (!token) {
			const email = req.user?.email
			if (!email) {
				return res.status(401).json({ message: 'Not authenticated.' })
			}
			const user = await User.findOne({ email })
			if (!user) {
				req.logout(err => {
					if (err) return next(err)
				})

				return res
					.status(401)
					.clearCookie('connect.sid')
					.json({ message: 'No account' })
			}
			io.emit('getOnlineUsers', Object.keys(userSocketMap))
			return res
				.status(200)
				.cookie('token', resData(user).token, resData(user).cookieData)
				.json(resData(user).userData)
		}

		const decode = jwt.verify(token, process.env.JWT_SECRET_KEY)
		if (!decode) {
			return res.status(401).json({ message: 'Invalid token' })
		}

		const user = await User.findOne({ _id: decode.userId })
		io.emit('getOnlineUsers', Object.keys(userSocketMap))
		return res
			.status(200)
			.cookie('token', resData(user).token, resData(user).cookieData)
			.json(resData(user).userData)
	} catch (error) {
		console.log(error)
	}
}
