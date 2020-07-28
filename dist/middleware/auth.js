"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
//Protect routes
const async_1 = __importDefault(require("./async"));
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const user_1 = __importDefault(require("../models/user"));
const jwt = __importStar(require("jsonwebtoken"));
const config_1 = require("../config/config");
exports.protect = async_1.default(async (req, res, next) => {
    let token = '';
    const { authorization = '' } = req.headers;
    if (authorization && authorization.startsWith('Bearer')) {
        token = authorization.split(' ')[1];
    }
    if (!token) {
        return next(new errorHandler_1.default('Not authorized to access this route', 401));
    }
    try {
        let decoded;
        if (req.url.includes('token')) {
            decoded = jwt.verify(token, config_1.config.JWT_REFRESH_SECRET);
        }
        else {
            decoded = jwt.verify(token, config_1.config.JWT_SECRET);
        }
        const user = await user_1.default.findById(decoded.id);
        //     .populate({
        //     path: 'strava',
        //     select: 'athlete'
        // });
        if (user) {
            req.user = user;
        }
        next();
    }
    catch (e) {
        console.log(e);
        return next(new errorHandler_1.default('Not authorized to access this route', 401));
    }
});
// export const authorized = (...role) => {
//   return (req, res, next) => {
//     const { role: userRole } = req.user;
//     if (!role.includes(userRole)) {
//       return next(
//         new ErrorHandler(
//           `User role ${userRole} is not authorized to access this route`,
//           403
//         )
//       );
//     }
//     next();
//   };
// };
//# sourceMappingURL=auth.js.map