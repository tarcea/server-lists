import { ITodo } from "./../types/todo";
import { model, Schema } from "mongoose";

const todoSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    cost: {
      type: String,
      required: false,
    },
    done: {
      type: Boolean,
      required: true,
    },
    // subtasks: [this],
  },
  { timestamps: true }
);

export default model<ITodo>("Todo", todoSchema);