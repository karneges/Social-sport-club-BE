"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAuthentication = void 0;
const user_utils_1 = require("../utils/user.utils");
exports.userAuthentication = (socket) => async (token, callback) => {
    let user;
    try {
        user = await user_utils_1.getUserByToken(token);
        if (user) {
            user.socketId = socket.id;
            user = await user.save();
            callback(true);
            console.log(`User ${user === null || user === void 0 ? void 0 : user.name} passed auth `.green);
            socket.broadcast.emit('userChangeOnlineStatus', user);
        }
    }
    catch (e) {
        console.error(`User  with id ${socket.id} no failed auth `);
        callback(false);
    }
};
//# sourceMappingURL=socket.auth.controller.js.map