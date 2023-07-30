class Users {
  constructor() {
    this.users = [];
  }

  createUser(name) {
    this.users.push({
      name,
      id: generateRandomId(),
    });
  }

  getUser(name) {
    console.log(this.users);
    const user = this.users.find((u) => u.name === name);
    if (!user) {
      return undefined;
    }
    return user;
  }

  addSessionId(name, sessionId) {
    if (!this.getUser(name)) {
      return;
    }
    const uIdx = this.users.map((u) => u.name).indexOf(name);
    this.users[uIdx] = {
      ...this.users[uIdx],
      socketId: sessionId,
    };
  }
}

class Rooms {
  constructor() {
    this.rooms = [];
  }

  createRoom(name) {
    this.rooms.push({
      name,
      users: [],
      messages: [],
      id: generateRandomId(),
    });
  }

  joinRoom(roomName, user) {
    const allRooms = this.rooms.map((r) => r.name);
    const roomIdx = allRooms.indexOf(roomName);
    if (roomIdx >= 0) {
      const userExistsInRoom = this.getUserFromRoom(roomName, user.name);
      if (userExistsInRoom) {
        return;
      } else {
        this.rooms[roomIdx]?.users?.push(user);
      }
    } else {
      throw new Error(`${roomName} Does not Exist`);
    }
  }

  getRoom(name) {
    const room = this.users.find((r) => r.name === name);
    if (!room) {
      return undefined;
    }
    return room;
  }

  getUserFromRoom(roomIdx, userName) {
    const user = this.rooms[roomIdx]?.users.find((u) => u.name === userName);
    if (user) {
      return true;
    }
    return false;
  }

  pushMessage(roomName,payload) {
    const allRooms = this.rooms.map((r) => r.name);
    const roomIdx = allRooms.indexOf(roomName);
    this.rooms[roomIdx].messages.push({ ...payload, messageId: generateRandomId() });
  }
}
// Generate a random string with 6 characters
function generateRandomId() {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const id = `${timestamp}_${randomString}`;
  return id;
}

module.exports = {
  Rooms,
  Users,
};

/**
 *  const user = userHandler.getUser(userName);
    if (!user) {
        console.log(`${userName} does not exist`);
        return
    }
    roomHandler.joinRoom(roomName, user);
    console.log(
      roomHandler.rooms.map(({ name, users, id }) => {
        return { name, id, users: users.map((u) => JSON.stringify(u)) };
      })
    );
 */
