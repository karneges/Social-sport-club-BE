import {NextFunction, Request, Response} from "express";

import ErrorResponse from '../utils/errorHandler';

const errorHandler = (err:any, req: Request, res: Response, next: NextFunction) => {
  let error = { ...err };
  error.message = err.message;
  //Log to console for dev
  console.log(`${err.stack}`.red);
  console.log(`${err}`.red);

  //Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Bootcamp not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }


  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  if (err.name === 'ValidationError') {
    const message:string = <string><unknown>Object.values(err.errors).map(((err: any) => err.message))
   error = new ErrorResponse(message, 400)
  }

  res.status(error.status || 500).json({
    success: false,
    error: error.message || 'Server error'
  });
};
export default errorHandler;
