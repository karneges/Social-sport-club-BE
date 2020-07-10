"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userDisconnect = void 0;
const user_utils_1 = require("../utils/user.utils");
exports.userDisconnect = (socket) => async () => {
    const user = await user_utils_1.getUserBySocketId(socket.id);
    console.log(`User ${user === null || user === void 0 ? void 0 : user.name} disconnect`.yellow);
    if (user) {
        user.socketId = '';
        await user.save();
        socket.broadcast.emit('userChangeOnlineStatus', user);
    }
};
//# sourceMappingURL=socket.disconnect.controller.js.map