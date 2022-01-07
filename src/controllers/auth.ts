import { Response, Request } from 'express';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import { IUser } from '../types/user';
import mongoose, { ObjectId } from 'mongoose';
import User from '../models/user';
import dotenv from 'dotenv';

dotenv.config();

const secret: string = process.env.JWT_SECRET!;

const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body
    const userExists = await User.findOne({ email: email });
    new Error('oops')
    if (userExists) {
      res.status(400).json({ message: 'this email already exists, please sign in' })
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    const user: IUser = new User({
      ...req.body,
      password: hashedPassword
    });
    const newUser: IUser = await user.save();
    const createdUser = await User.findOne({ email: email });
    const token = JWT.sign({ email }, secret, { expiresIn: '8h' })
    res.status(201).json({ token, userId: createdUser?._id, username: createdUser?.username })
  } catch (error) {
    let message = 'Unknown Error'
    if (error instanceof Error) message = error.message
    res.status(500).json({ message })
  }
};

const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body
    const user = await User.findOne({ username });
    if (!user) {
      res.status(400).json({ message: 'The details provided are not correct.' })
      return;
    }
    const passwordMatches: boolean = await bcrypt.compare(password, user.password!)
    if (passwordMatches) {
      const token = JWT.sign({ userId: user._id }, secret, { expiresIn: '8h' })
      delete user.password
      res.status(201).json({ token, userId: user?._id, username: user?.username })
      return
    } else {
      res.status(400).json({ message: 'The details provided are not correct.' })
    }
  } catch (error) {
    throw error;
  }
};

export {
  login,
  signup
};
