type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'INR';

type TransactionStatus = 'pending' | 'processing' | 'completed' | 'failed';

interface ClientTransactionRequest {
  amount: number;
  currency: Currency;
  description: string;
  metadata?: Record<string, any>;
}

interface ClientTransactionResponse {
  transactionId: string;
  status: TransactionStatus;
  submittedAt: string;
  completedAt?: string;
  error?: string;
}

interface Transaction {
  id: string;
  amount: number;
  currency: Currency;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

interface TransactionState {
  id: string;
  transaction: Transaction;
  status: TransactionStatus;
  retryCount: number;
  createdAt: string;
  updatedAt: string;
  error?: string;
}

export {
  Currency,
  TransactionStatus,
  ClientTransactionRequest,
  ClientTransactionResponse,
  Transaction,
  TransactionState,
}
