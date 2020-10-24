class Global {
    constructor() {
        this.globalRoom = [];
    }
    addUserToGlobalRoom(id, name, room, img) {
        // using es6 object destructuring
        let roomName = { id, name, room, img };
        this.globalRoom.push(roomName);
        return roomName;
    }
    getUsersFromGlobalRoom(room) {
        let roomName = this.globalRoom.filter(user => user.room === room);
        let namesArr = roomName.map(user => {
            return {
                name: user.name,
                img: user.img
            };
        });
        return namesArr;
    }

    getUser(id) {
        let getUser = this.globalRoom.filter(user => user.id === id)[0];
        return getUser;
    }

    removeUser(id) {
        let user = this.getUser(id);
        if (user) {
            this.globalRoom = this.globalRoom.filter(user => user.id !== id);
        }
        return user;
    }
}

module.exports = { Global };