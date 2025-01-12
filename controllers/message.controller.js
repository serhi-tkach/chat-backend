import { io } from '../index.js'
import { Message } from '../models/message.model.js'
import { getSocketId } from '../socket/socket.js'

export const sendMessage = async (req, res) => {
	try {
		const senderId = req.params.id
		const { message, receiverId } = req.body
		const newMessage = await Message.create({
			senderId,
			receiverId,
			message,
		})

		const receiverSocketId = getSocketId(receiverId)
		const senderSocketId = getSocketId(senderId)

		if (receiverSocketId && senderSocketId)
			io.to(receiverSocketId).to(senderSocketId).emit('newMessage', newMessage)

		return res.status(201).json(newMessage)
	} catch (error) {
		console.log(error)
	}
}

export const getMessages = async (req, res) => {
	try {
		const messages = await Message.find({
			$or: [
				{ senderId: req.id, receiverId: req.params.id },
				{ senderId: req.params.id, receiverId: req.id },
			],
		})
		return res.status(200).json(messages)
	} catch (error) {
		console.log(error)
	}
}

export const deleteMessages = async (req, res) => {
	try {
		const deleteMessages = await Message.deleteMany({
			$or: [
				{ senderId: req.id, receiverId: req.params.id },
				{ senderId: req.params.id, receiverId: req.id },
			],
		})
		return res.status(200).json(deleteMessages)
	} catch (error) {
		console.log(error)
	}
}

export const updateMessage = async (req, res) => {
	try {
		const { message } = req.body
		const updateMessage = await Message.findByIdAndUpdate(
			{ _id: req.params.id },
			{ message },
		)
		await updateMessage.save()

		return res.status(200).json(updateMessage)
	} catch (error) {
		console.log(error)
	}
}
