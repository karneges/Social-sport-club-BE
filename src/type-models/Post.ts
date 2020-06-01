import { Document, Schema } from 'mongoose'
import express from 'express';

export interface Post {
  id: string;
  title: string;
  content: string;
  image?: any
}


export interface PostInMongo extends Document {
  title: string;
  content: string;
  createdAt: Date
  image?: any;
  creator: Schema.Types.ObjectId;
}

export interface UserInMongo extends Document, UserInMongoMethods {
  name: string;
  email: string;
  role: 'user' | 'admin'
  password: any;
  createdAt: Date
  token?: string;
}

interface UserInMongoMethods {
  getSignetJwtToken: () => string
  matchPassword: (enteredPassword: string) => Promise<boolean>
}

export interface User {
  name: string;
  email: string;
  password?: string
  token?: string
  _id: string
  role: string
}

export interface UserRequest extends User, express.Request {

}

export interface UserResponse extends User, express.Request {

}


export interface PostRequest extends Post, express.Request {
}


export interface Request<Body = any,
  Query = any,
  Params = any,
  Cookies = any,
  > extends Express.Request {
  body: Body;
  query: Query;
  params: Params;
  cookies: Cookies;
  headers: { authorization: string }
  user: UserInMongo
  advancedResult: AdvancedResult
}

interface AdvancedResult {
  success: boolean
  count: number
  pagination: any
  data: any
}
