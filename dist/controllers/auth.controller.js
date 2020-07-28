"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDetails = exports.getNewAccessToken = exports.getMe = exports.login = exports.register = void 0;
const user_1 = __importDefault(require("../models/user"));
const async_1 = __importDefault(require("../middleware/async"));
const utils_1 = require("../utils/utils");
const errorHandler_1 = __importDefault(require("../utils/errorHandler"));
const password_generator_1 = __importDefault(require("password-generator"));
//@desc         Register user
//@route        GET /api/v1/auth/register
//@access       Public
exports.register = async_1.default(async (req, res) => {
    if (req.body.gId) {
        req.body.password = password_generator_1.default();
    }
    const { name, email, password, role, gId = '', photoUrl = '' } = req.body;
    const user = await user_1.default.create({
        name,
        email,
        password,
        role,
        gId,
        photoUrl
    });
    sendTokenResponse(user, 200, res);
});
//@desc         Login user
//@route        GET /api/v1/auth/login
//@access       Public
exports.login = async_1.default(async (req, res, next) => {
    const { email, password = '', gId } = req.body;
    const user = await user_1.default.findOne({ email }).select('+password').select('+gId');
    if (!user) {
        return next(new errorHandler_1.default('Invalid login or password', 401));
    }
    const isValidPassword = await user.matchPassword(password ? password : gId, !!gId);
    if (!isValidPassword) {
        return next(new errorHandler_1.default('Invalid login or password', 401));
    }
    sendTokenResponse(user, 200, res);
});
//@desc         Login user
//@route        GET /api/v1/auth/me
//@access       Public
exports.getMe = async_1.default(async (req, res, next) => {
    const user = await req.user.populate({
        path: 'strava',
        select: 'athlete'
    }).execPopulate();
    res.status(200).json({
        success: true,
        user
    });
});
//@desc         Login user
//@route        GET /api/v1/auth/token
//@access       Private
exports.getNewAccessToken = async_1.default(async (req, res, next) => {
    sendTokenResponse(req.user, 200, res);
});
//@desc         Update user details
//@route        PUT /api/v1/auth/updatedetails
//@access       Private
exports.updateDetails = async_1.default(async (req, res, next) => {
    const { email, name } = req.body;
    const fieldUpdate = { email, name };
    const user = await user_1.default.findByIdAndUpdate(req.user.id, fieldUpdate, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        success: true,
        data: user
    });
});
const sendTokenResponse = (user, statusCode, res) => {
    //Create token
    const token = user.getSignetJwtToken();
    const refreshToken = user.getRefreshSignetJwtToken();
    const response = {
        success: true,
        token,
        refreshToken,
        expiresIn: utils_1.getExpireTokenDate()
    };
    res
        .status(statusCode)
        .json(response);
};
//# sourceMappingURL=auth.controller.js.map