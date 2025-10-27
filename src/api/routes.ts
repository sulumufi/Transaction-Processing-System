import { Router } from 'express';
import { createTransaction, getTransaction, getHelth } from './controller';

const router = Router();

router.post('/transactions', createTransaction);

router.get('/transactions/:id', getTransaction);

router.get('/health', getHelth);

export { router };
