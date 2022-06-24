import { Router } from 'express';
import {
  getLists,
  getListById,
  toggleListDone,
  updateListName,
  addList,
  addTodo,
  getTodos,
  toggleTodoDone,
  deleteTodo,
  deleteList,
  updateTodo,
} from '../controllers';

const router: Router = Router();

router.get('/lists', getLists);
router.get('/lists/:id', getListById);
router.put('/lists/:id', updateListName);
router.post('/lists', addList);
router.get('/lists/:id/todos', getTodos);
router.post('/lists/:id/todos', addTodo);
router.put('/lists/:listId/todos/:todoId/toggle', toggleTodoDone);
router.put('/lists/:listId/todos/:todoId', updateTodo);
router.delete('/lists/:listId/todos/:todoId', deleteTodo);
router.delete('/lists/:listId', deleteList);

export default router;
