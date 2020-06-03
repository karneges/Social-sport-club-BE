

//Protect routes
import asyncHandler from "./async";
import ErrorHandler from "../utils/errorHandler";
import User from '../models/user'
import * as jwt from 'jsonwebtoken'
import { config } from "../config/config";
import { NextFunction, Request, Response } from "express";
import { AddUserToRequest, Params } from "../type-models/express.models";


export const protect  = asyncHandler(async (req: Request<Params> & AddUserToRequest, res:Response, next: NextFunction) => {
  let token = '';
  const { authorization = '' } = req.headers;
  if (authorization && authorization.startsWith('Bearer')) {
    token = authorization.split(' ')[1];
  }
  if (!token) {
    return next(new ErrorHandler('Not authorized to access this route', 401));
  }
  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as {id: string};
    const user = await User.findById(decoded.id);
    if (user){
      req.user = user
    }
    next();
  } catch (e) {
    console.log(e)
    return next(new ErrorHandler('Not authorized to access this route', 401));
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
