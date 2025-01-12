import { Router } from 'express'
import isAuthenticated from '../middleware/isAuthenticated.js'
import {
	deleteMessages,
	getMessages,
	sendMessage,
	updateMessage,
} from '../controllers/message.controller.js'

const router = Router()

router.post('/send/:id', isAuthenticated, sendMessage)
router.get('/:id', isAuthenticated, getMessages)
router.delete('/:id', isAuthenticated, deleteMessages)
router.patch('/:id', isAuthenticated, updateMessage)

export default router
