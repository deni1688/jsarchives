module.exports = function(io, Global, lodash) {
    const clients = new Global();
    io.on('connection', socket => {
        socket.on('globalroom', global => {
            socket.join(global.room);
            clients.addUserToGlobalRoom(socket.id, global.name, global.room, global.img);
            let activeUsers = clients.getUsersFromGlobalRoom(global.room);
            let unique = lodash.uniqBy(activeUsers, 'name');
            io.to(global.room).emit('globalclients', unique);
        });
        socket.on('disconnect', () => {
            const user = clients.removeUser(socket.id);
            if (user) {
                let userData = clients.getUsersFromGlobalRoom(user.room);
                let unique = lodash.uniqBy(userData, 'name');
                lodash.remove(userData, { 'name': user.name });
                io.to(user.room).emit('globalclients', unique);
            }
        });
    });
};