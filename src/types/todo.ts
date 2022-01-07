import { Document, ObjectId } from "mongoose";

export interface ITodo extends Document {
  name: string;
  description: string;
  cost: number;
  done?: boolean;
  _id?: string;
}

export interface IList extends Document {
  name: string;
  done: boolean;
  userId: string;
  todos: ITodo[];
  _id?: any;
}