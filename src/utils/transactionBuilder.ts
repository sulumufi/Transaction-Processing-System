import { v4 as uuidv4 } from 'uuid';
import {
  ClientTransactionRequest,
  Transaction,
  TransactionState,
} from '../models/transactions';

const buildTransaction = (request: ClientTransactionRequest): Transaction => {
  const transaction: Transaction = {
    id: uuidv4(),
    amount: request.amount,
    currency: request.currency,
    description: request.description,
    timestamp: new Date().toISOString(),
    metadata: request.metadata,
  };

  return transaction;
};

const buildTransactionState = (transaction: Transaction): TransactionState => {
  const transactionState: TransactionState = {
    id: transaction.id,
    retryCount: 0,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    transaction: transaction,
  };

  return transactionState;
};

export { buildTransaction, buildTransactionState };
