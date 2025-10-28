import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
const API_BASE_URL = 'http://localhost:3000';
import { ClientTransactionRequest } from './models/transactions';
const NUM_TRANSACTIONS = 100;
const DELAY_BETWEEN_REQUESTS = 500;

interface apiRequestPayload {
  transactionId: string;
  amount: number;
  currency: string;
  description: string;
  metadata?: Record<string, any>;
}

const generateTransaction = (): ClientTransactionRequest => {
  return {
    transactionId: uuidv4(),
    amount: Math.round((Math.random() * 1000 + 10) * 100) / 100,
    currency: 'USD',
    description: `Test transaction ${Date.now()}`,
  };
};

const submitTransaction = async (
  payload: apiRequestPayload
): Promise<Record<string, any> | null> => {
  const startTime = Date.now();

  try {
    const response = await axios.post(`${API_BASE_URL}/transactions`, payload, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000,
    });

    const responseTime = Date.now() - startTime;

    return {
      responseTime,
      status: response.status,
      data: response.data,
    };
  } catch (error: any) {
    console.log(JSON.stringify(error));
    return null;
  }
};

const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const checkHealthEndpoint = async (): Promise<boolean> => {
  const response = await axios.get(`${API_BASE_URL}/health`);
  if (response.data.status == 'Healthy') {
    return true;
  }
  return false;
};

const runTest = async () => {
  const isHealthy = await checkHealthEndpoint();
  if (!isHealthy) {
    console.log('Not healthy, Returning...');
    return;
  }

  console.log('Healty, Proceeding with next steps');

  const completedTransactions = [];

  for (let i = 0; i <= NUM_TRANSACTIONS; i++) {
    const payload: apiRequestPayload = generateTransaction();
    console.log(JSON.stringify(payload));
    const response = await submitTransaction(payload);
    completedTransactions.push(response);
    await sleep(DELAY_BETWEEN_REQUESTS);
  }

  console.log(completedTransactions);
};

runTest();
