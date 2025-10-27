import { Request, Response } from 'express';
import { validateTransactionRequest } from '../utils/validator';
import {
  buildTransaction,
  buildTransactionState,
} from '../utils/transactionBuilder';
import {
  saveTransactionState,
  getTransactionState,
} from '../services/stateStore';
import { enqeueMain } from '../services/queue';
import {
  ClientTransactionResponse,
  TransactionState,
} from '../models/transactions';

const createTransaction = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const transactionStarted = new Date().toISOString();
    const { isValid, description } = validateTransactionRequest(body);
    if (!isValid) {
      return res.status(400).json({ error: description });
    }

    const transaction = buildTransaction(body);
    const transactionState = buildTransactionState(transaction);

    await saveTransactionState(transactionState);
    await enqeueMain(transaction.id);

    const clientReponse: ClientTransactionResponse = {
      transactionId: transaction.id,
      submittedAt: transactionStarted,
      status: 'pending',
    };

    res.status(202).json(clientReponse);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getTransaction = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (!id || typeof id != 'string') {
      return res.status(400).json({ error: 'invalid data in id field' });
    }

    const transactionState: TransactionState | null =
      await getTransactionState(id);
    if (!transactionState) {
      return res.status(404).json({
        id: id,
        status: 'transaction id not present ',
      });
    } else {
      const response: ClientTransactionResponse = {
        transactionId: transactionState.id,
        status: transactionState.status,
        submittedAt: transactionState.createdAt,
        completedAt:
          transactionState.status == 'completed'
            ? transactionState.updatedAt
            : undefined,
        error: transactionState.error,
      };
      res.status(200).json(response);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getHelth = (req: Request, res: Response) => {
  try {
    console.log('herell');
    res.json({
      status: 'Healthy',
      timeStamp: new Date().toISOString(),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
    console.log(error);
  }
};

export { createTransaction, getTransaction, getHelth };
