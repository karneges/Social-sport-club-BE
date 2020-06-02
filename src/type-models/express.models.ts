import { NextFunction, Request, RequestHandler, Response } from "express";


export interface Params {
    [key: string]: string;
    'id'?: string
}

