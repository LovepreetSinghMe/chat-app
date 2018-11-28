class Rooms {
    constructor() {
        this.roomsList = [];
    }

    createRoom(roomName) {
        this.roomsList.push(roomName);
    }

    deleteRoom(roomName) {
        this.roomsList = this.roomsList.filter(room => room !== roomName);
    }

    checkRoomExists(roomName) {
        return this.roomsList.includes(roomName);
    }

}

module.exports = {Rooms};