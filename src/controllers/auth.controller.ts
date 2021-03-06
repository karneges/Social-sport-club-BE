import User, { UserModel } from '../models/user'
import asyncHandler from '../middleware/async';
import { NextFunction, Request, Response } from 'express';
import { AddUserToRequest, AuthQuery, Params } from '../type-models/express.models';
import { getExpireTokenDate } from '../utils/utils';
import { TokenResponseModel } from '../type-models/token-response.model';
import ErrorHandler from '../utils/errorHandler';
import { AuthRegisterCredential } from '../type-models/auth.model';
import passwordGenerator from 'password-generator'


//@desc         Register user
//@route        GET /api/v1/auth/register
//@access       Public
export const register = asyncHandler(async (req: Request<Params, any, AuthRegisterCredential, AuthQuery>, res: Response) => {
    if (req.body.gId) {
        req.body.password = passwordGenerator()
    }
    const { name, email, password, role, gId = '', photoUrl = '' } = req.body;
    const user = await User.create({
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
export const login = asyncHandler(async (req: Request<Params>, res: Response, next: NextFunction) => {
    const { email, password = '', gId } = req.body;
    const user = await User.findOne({ email }).select('+password').select('+gId')
    if (!user) {
        return next(
            new ErrorHandler('Invalid login or password', 401)
        )
    }

    const isValidPassword = await user.matchPassword(password ? password : gId, !!gId)
    if (!isValidPassword) {
        return next(
            new ErrorHandler('Invalid login or password', 401)
        )
    }
    sendTokenResponse(user, 200, res);
});

//@desc         Login user
//@route        GET /api/v1/auth/me
//@access       Public
export const getMe = asyncHandler(async (req: Request<Params> & AddUserToRequest, res: Response, next: NextFunction) => {
    const user = await req.user.populate({
        path:'strava',
        select: 'athlete'
    }).execPopulate()
    res.status(200).json({
        success: true,
        user
    });
});

//@desc         Login user
//@route        GET /api/v1/auth/token
//@access       Private
export const getNewAccessToken = asyncHandler(async (req: Request<Params> & AddUserToRequest, res: Response, next: NextFunction) => {
    sendTokenResponse(req.user, 200, res)
})

//@desc         Update user details
//@route        PUT /api/v1/auth/updatedetails
//@access       Private
export const updateDetails = asyncHandler(async (req: Request<Params> & AddUserToRequest, res: Response, next: NextFunction) => {
    const { email, name } = req.body;
    const fieldUpdate = { email, name };

    const user = await User.findByIdAndUpdate(req.user.id, fieldUpdate, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        success: true,
        data: user
    });
});


const sendTokenResponse = (user: UserModel, statusCode: number, res: Response) => {
    //Create token
    const token = user.getSignetJwtToken();
    const refreshToken = user.getRefreshSignetJwtToken()
    const response: TokenResponseModel = {
        success: true,
        token,
        refreshToken,
        expiresIn: getExpireTokenDate()
    }
    res
        .status(statusCode)
        .json(response);
};
