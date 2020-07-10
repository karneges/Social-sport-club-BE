"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketConnect = void 0;
const socket_auth_controller_1 = require("./socket-controllers/socket.auth.controller");
const socket_disconnect_controller_1 = require("./socket-controllers/socket.disconnect.controller");
const socket_messages_controller_1 = require("./socket-controllers/socket.messages.controller");
exports.socketConnect = (socket) => {
    console.log(`new user connect! ${socket.id}`);
    socket.on('auth', socket_auth_controller_1.userAuthentication(socket));
    socket.on('disconnect', socket_disconnect_controller_1.userDisconnect(socket));
    socket.on('newMessage', socket_messages_controller_1.newMessage(socket));
    socket.on('messageReade', socket_messages_controller_1.messageWasReade(socket));
};
//# sourceMappingURL=socket.connect.js.map