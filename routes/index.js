import { Router } from 'express'
import authRouter from './auth.router.js'
import userRouter from './user.router.js'
import messageRouter from './message.router.js'

const router = Router()

router.use('/auth', authRouter)
router.use('/user', userRouter)
router.use('/message', messageRouter)

export default router
