import { Response, Request, NextFunction } from 'express';
import JWT from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.JWT_SECRET!;

export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.authorization) {
      res.status(400).json({ error: 'No token' });
      return
    }
    const token = req.headers.authorization
    const decodedToken = JWT.verify(token, secret)
    res.locals.decodedToken = decodedToken;
    res.locals.token = token;
    next()
  } catch (err) {
    res.status(401).json({ error: err });
  }
}