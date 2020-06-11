"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExpireTokenDate = void 0;
const config_1 = require("../config/config");
exports.getExpireTokenDate = () => {
    let jwtExpireHours = config_1.config.JWT_EXPIRE;
    const numberPattern = /\d+/g;
    const countTokenLiveHours = +jwtExpireHours.match(numberPattern)[0];
    // return new Date(Date.now() + countTokenLiveHours * 60 * 60 * 1000) //expiration token date
    return new Date(Date.now() + countTokenLiveHours * 1000); //expiration token date
};
//# sourceMappingURL=utils.js.map