import { Router } from 'express'
import {
	checkAuth,
	login,
	logout,
	register,
} from '../controllers/auth.controller.js'
import passport from 'passport'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.get('/logout', logout)
router.get(
	'/google/callback',
	passport.authenticate('google', {
		failureRedirect: 'http://52.59.38.203/login',
		successRedirect: 'http://52.59.38.203/',
	}),
)
router.get('/check', checkAuth)

export default router
