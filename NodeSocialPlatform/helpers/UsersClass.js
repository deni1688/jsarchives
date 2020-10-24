class Users {
    constructor() {
        this.users = [];
    }
    addUsersData(id, name, room) {
        // using es6 object destructuring
        let users = { id, name, room }
        this.users.push(users);
    }
    getActiveUsers(room) {
        let users = this.users.filter(user => user.room === room);
        let namesArr = users.map(user => user.name);
        return namesArr;
    }
    getUser(id) {
        let getUser = this.users.filter(user => user.id === id)[0];
        return getUser;
    }
    removeUser(id) {
        let user = this.getUser(id);
        if (user) {
            this.users = this.users.filter(user => user.id !== id);

        }
        return user;
    }
}

module.exports = { Users };