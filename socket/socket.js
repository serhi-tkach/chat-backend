export const userSocketMap = {}
export const getSocketId = userId => userSocketMap[userId]

export default io => {
	io.on('connection', socket => {
		const { userId } = socket.handshake.query
		console.log(`${socket.id} user connected`, userId)

		if (userId) {
			userSocketMap[userId] = socket.id
		}

		io.emit('getOnlineUsers', Object.keys(userSocketMap))

		socket.on('notification', (selectedUser, firstName, lastName) => {
			io.to(userSocketMap[selectedUser]).emit(
				'notification_message',
				`You have a notification from ${firstName} ${lastName}`,
			)
		})

		socket.on('disconnect', () => {
			delete userSocketMap[userId]
			io.emit('getOnlineUsers', Object.keys(userSocketMap))

			console.log(`${socket.id} user disconnected`, userId)
		})
	})
}
