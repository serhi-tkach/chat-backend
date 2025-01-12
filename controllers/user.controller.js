import { Message } from '../models/message.model.js'
import { NUMBER_OF_PREDEFIENED_CHATS } from '../utils/consts.js'
import { User } from '../models/user.model.js'

export const getOtherUsers = async (req, res) => {
	try {
		let user = {}
		const ids = []
		const usersWithMessages = []
		for (let i = 0; i < NUMBER_OF_PREDEFIENED_CHATS; i++) {
			const message = await Message.find({
				$or: [
					{ receiverId: req.id, senderId: { $nin: ids } },
					{ senderId: req.id, receiverId: { $nin: ids } },
				],
			})
				.sort({ createdAt: -1 })
				.limit(1)
			if (!message.length) break
			if (message[0].receiverId == req.id) {
				ids.push(message[0].senderId)
				user = await User.findById(
					{ _id: message[0].senderId },
					{ _id: 1, firstName: 1, lastName: 1, profilePhoto: 1 },
				)
			} else {
				ids.push(message[0].receiverId)
				user = await User.findById(
					{ _id: message[0].receiverId },
					{ _id: 1, firstName: 1, lastName: 1, profilePhoto: 1 },
				)
			}

			usersWithMessages.push({
				...user._doc,
				message: message[0].message,
				date: message[0].createdAt,
			})
		}

		await Message.deleteMany({
			$or: [
				{ receiverId: req.id, senderId: { $nin: ids } },
				{ senderId: req.id, receiverId: { $nin: ids } },
			],
		})

		const usersWithoutMessages = await User.find({
			_id: { $nin: [...ids, req.id] },
		}).select('-password')

		const otherUsers = usersWithMessages.concat(
			usersWithoutMessages.map((user, ind) => ({
				_id: user._id,
				firstName: user.firstName,
				lastName: user.lastName,
				profilePhoto: user.profilePhoto,
				message: '',
				date: '',
			})),
		)

		return res.status(200).json(otherUsers)
	} catch (error) {
		console.log(error)
	}
}

export const updateUser = async (req, res) => {
	try {
		const { firstName, lastname } = req.body
		const updateUser = await Message.findByIdAndUpdate(
			{ _id: req.id },
			{ firstName, lastname },
		)
		await updateUser.save()

		return res.status(200).json(updateUser)
	} catch (error) {
		console.log(error)
	}
}
