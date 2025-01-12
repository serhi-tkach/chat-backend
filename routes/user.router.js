import { Router } from 'express'
import { getOtherUsers, updateUser } from '../controllers/user.controller.js'
import isAuthenticated from '../middleware/isAuthenticated.js'

const router = Router()

router.get('/', isAuthenticated, getOtherUsers)
router.patch('/', isAuthenticated, updateUser)

export default router
