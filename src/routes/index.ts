import { Router } from 'express';
import { verifyUser } from '../middlewares/verifyUser';
import {
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
} from '../controllers';

const router: Router = Router();

router.get('/lists', verifyUser, getLists);
router.get('/lists/:id', verifyUser, getListById);
router.put('/lists/:id', verifyUser, toggleListDone);

router.post('/lists', verifyUser, addList);

// router.delete('/lists/:id', deleteTodoList);

router.get('/lists/:id/todos', verifyUser, getTodos);

router.post('/lists/:id/todos', verifyUser, addTodo);
// router.post('/lists/:listId/todos/:todoId/subtasks', addSubtask);

router.put('/lists/:listId/todos/:todoId/toggle', toggleTodoDone);
router.put('/lists/:listId/todos/:todoId', verifyUser, updateTodo);
router.delete('/lists/:listId/todos/:todoId', deleteTodo);
router.delete('/lists/:listId', deleteList);

export default router;