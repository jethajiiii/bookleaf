import { Router } from 'express';
import * as bookController from '../controllers/book.controller.js';

const router = Router();

router.get('/', bookController.getMyBooks);

export default router;
