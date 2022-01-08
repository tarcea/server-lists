import { Response, Request } from 'express';
import { ITodo, IList } from '../types/todo';
import mongoose, { ObjectId } from 'mongoose';
import Todo from '../models/todo';
import List from '../models/list';

const getLists = async (req: Request, res: Response): Promise<void> => {
  try {
    const fetchedList: IList[] = await List.find();
    const { userId } = res.locals.decodedToken;
    const lists = fetchedList.filter(list => list.userId === userId)
    res.status(200).json({ lists, userId });
  } catch (error) {
    let message = 'Unknown Error'
    if (error instanceof Error) message = error.message
    res.status(500).json({ message })
  }
};

const getListById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { userId } = res.locals.decodedToken;
    const findedList = await List.findById(id);
    const list: IList = findedList!;
    if (list.userId === userId) {
      res.status(200).json({ list });
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  } catch (error) {
    throw error;
  }
};

const toggleListDone = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const list = await List.findById(id);
    await List.findOneAndUpdate(
      { _id: id },
      { $set: { done: !list?.done } }
    );
    res.status(200).json({});
  } catch (error) {
    throw error;
  }
};

const addList = async (req: Request, res: Response): Promise<void> => {
  try {
    const body = req.body as Pick<IList, 'name' | 'done' | 'userId'>;
    const { name, done, userId } = body;
    const list: IList = new List({
      name,
      done,
      userId
    });
    const newList: IList = await list.save();

    res.status(201).json({
      message: 'new list added',
      list: newList
    });
  } catch (error) {
    throw error;
  }
};

const deleteList = async (req: Request, res: Response): Promise<void> => {
  try {
    // TODO: allow list deletion just if the todos array is empty or all todos are done
    const { listId } = req.params;

    await List.findOneAndDelete(
      { _id: listId }
    ).exec();
    res.status(200).json({
      message: 'list deleted'
    });
  } catch (error) {
    throw error;
  }
};

const addTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const listId = req.params.id;
    const body = req.body as Pick<
      ITodo,
      'name' | 'description' | 'cost' | 'done'
    >;
    const { name, description, cost, done } = body;
    const todo: ITodo = new Todo({
      name,
      description,
      cost,
      done,
    });
    await List.updateOne({ _id: listId }, { $push: { todos: todo } });
    res.status(201).json({ message: 'new todo added', todo });
  } catch (error) {
    throw error;
  }
};

const getTodos = async (req: Request, res: Response): Promise<void> => {
  let todos: ITodo[];
  try {
    const { userId } = res.locals.decodedToken;
    const { id } = req.params;
    const findedList = await List.findById(id);
    const list: IList = findedList!
    if (list?.userId === userId) {
      todos = list.todos!;
      res.status(200).json({ todos });
    } else {
      res.status(401).json({ message: 'Unauthorized' });
    }
  } catch (error) {
    throw error;
  }
};

const toggleTodoDone = async (req: Request, res: Response): Promise<void> => {
  try {
    let doneFlag: boolean = false;
    let todos: ITodo[];
    const todoId = new mongoose.Types.ObjectId(req.params.todoId);
    const { listId } = req.params;

    const findedList = await List.findById(listId);
    const list: IList = findedList!
    if (list) {
      todos = list.todos!;
      const toggledTodo: ITodo = todos.find((t: ITodo) => t._id?.toString() === req.params.todoId)!;
      doneFlag = toggledTodo.done!;
    };

    await List.findOneAndUpdate(
      { _id: listId, "todos._id": todoId },
      { $set: { "todos.$.done": !doneFlag } }
    );
    res.status(200).json({
      message: "Todo updated",
    });
  } catch (error) {
    throw error;
  }
};

const deleteTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    const todoId = new mongoose.Types.ObjectId(req.params.todoId);
    const { listId } = req.params;

    await List.updateOne(
      { _id: listId },
      {
        $pull: { todos: { _id: todoId } }
      }
    ).exec();
    res.status(200).json({
      message: 'todo deleted'
    });
  } catch (error) {
    throw error;
  }
};

const updateTodo = async (req: Request, res: Response): Promise<void> => {
  try {
    let todos: ITodo[];
    let updatedTodo: ITodo;
    const todoId = new mongoose.Types.ObjectId(req.params.todoId);
    const { listId } = req.params;
    const findedList = await List.findById(listId);
    const list: IList = findedList!
    if (list) {
      todos = list.todos!;
      updatedTodo = todos.find((t: ITodo) => t._id?.toString() === req.params.todoId)!;
      await List.findOneAndUpdate(
        { _id: listId, "todos._id": todoId },
        { $set: { "todos.$": { ...updatedTodo, ...req.body } } }
      );
      res.status(200).json({
        todo: { ...updatedTodo, ...req.body },
        message: "Todo updated",
      });
    };

  } catch (error) {
    throw error;
  }
};

export {
  getLists,
  getListById,
  toggleListDone,
  addList,
  addTodo,
  getTodos,
  toggleTodoDone,
  deleteTodo,
  deleteList,
  updateTodo
};
