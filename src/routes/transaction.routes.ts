import { Router } from 'express';

import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
// import CreateTransactionService from '../services/CreateTransactionService';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

const transactionRouter = Router();

const transactionsRepository = new TransactionsRepository();

transactionRouter.get('/', (request, response) => {
  try {
    const transactions = transactionsRepository.all();
    const balance = transactionsRepository.getBalance();
    return response.json({ transactions, balance });
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

transactionRouter.post('/', (request, response) => {
  try {
    const { title, value, type }: Request = request.body;

    if (type === 'outcome') {
      const balance = transactionsRepository.getBalance();

      if (balance.total - value < 0) {
        return response
          .status(400)
          .json({ error: 'Outcome value is bigger than total' });
      }
    }

    const transactions = transactionsRepository.create({ title, value, type });

    return response.json(transactions);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default transactionRouter;
