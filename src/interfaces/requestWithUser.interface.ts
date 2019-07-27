import { Request } from 'express';
import User from '../users/user.interface';
import mongoose from 'mongoose';
 
export interface RequestWithUser extends Request {
  user: User & mongoose.Document;
}