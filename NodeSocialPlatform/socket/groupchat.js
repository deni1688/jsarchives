module.exports = function(io, Users) {
    const users = new Users();
    io.on('connection', socket => {
        socket.on('join', (params, cb) => {
            socket.join(params.room);
            users.addUsersData(socket.id, params.sender, params.room);
            io.to(params.room).emit('activeUsers', users.getActiveUsers(params.room))
            cb();
        });
        socket.on('groupMessage', (message, cb) => {
            io.to(message.room).emit('groupMessage', {
                text: message.text,
                room: message.room,
                sender: message.sender,
                sender_id: message.sender_id,
                time: message.time
            });
            cb();
        });
        socket.on('disconnect', () => {
            let user = users.removeUser(socket.id);
            if (user) {
                io.to(user.room).emit('activeUsers', users.getActiveUsers(user.room));
            }
        });
    });
}