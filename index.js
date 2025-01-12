import { Server } from 'socket.io'
import http from 'node:http'
import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/database.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import passport from 'passport'
import session from 'express-session'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import socketHandler from './socket/socket.js'
import router from './routes/index.js'

dotenv.config({})

const app = express()
const PORT = process.env.PORT || 4000

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: `${process.env.APP_URL}/api/auth/google/callback`,
			scope: ['profile', 'email'],
		},
		async (accessToken, refreshToken, profile, done) => {
			done(null, { email: profile.emails[0].value })
		},
	),
)

passport.serializeUser((user, done) => {
	done(null, user)
})
passport.deserializeUser((user, done) => {
	done(null, user)
})

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
		cookie: { maxAge: 1000 * 60 * 60 },
	}),
)

app.use(passport.initialize())
app.use(passport.session())

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(
	cors({
		origin: 'http://localhost:5173',
		credentials: true,
	}),
)

app.use('/api', router)

const server = new http.Server(app)
export const io = new Server(server, {
	cors: {
		origin: 'http://localhost:5173',
		methods: ['GET', 'POST'],
	},
})

socketHandler(io)

server.listen(PORT, () => {
	connectDB()
	console.log(`Server listen at port ${PORT}`)
})
