import { IList } from "../types/todo";
import { model, Schema } from "mongoose";

const listSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    todos: [],
    done: {
      type: Boolean,
      required: true,
    }
  },
  { timestamps: true }
);

export default model<IList>("List", listSchema);