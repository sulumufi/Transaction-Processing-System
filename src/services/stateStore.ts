import Redis from 'ioredis';
import { TransactionState, TransactionStatus } from '../models/transactions';

const redisClient = new Redis({
  host: 'localhost',
  port: 6379,
});

const saveTransactionState = async (state: TransactionState): Promise<void> => {
  try {
    const key = `transaction:${state.id}`;
    await redisClient.set(key, JSON.stringify(state));
  } catch (error) {
    console.log(error);
  }
};

const getTransactionState = async (
  id: string
): Promise<TransactionState | null> => {
  try {
    const key = `transaction:${id}`;
    const data = await redisClient.get(key);
    if (!data) {
      return null;
    }
    return JSON.parse(data) as TransactionState;
  } catch (error) {
    console.log('error');
    return null;
  }
};

const updateStatus = async (
  id: string,
  status: TransactionStatus
): Promise<void> => {
  try {
    const key = `transaction:${id}`;

    const data = await redisClient.get(key);
    if (!data) {
      throw new Error('Transaction id does not exist');
    }
    const parsedData = JSON.parse(data);
    parsedData.status = status;
    parsedData.updatedAt = new Date().toISOString();
    await redisClient.set(key, JSON.stringify(parsedData));
  } catch (error) {
    console.log(error);
  }
};

const updateRetryCount = async (id: string): Promise<void> => {
  try {
    const key = `transaction:${id}`;

    const data = await redisClient.get(key);
    if (!data) {
      throw new Error('Transaction id does not exist');
    }
    const parsedData = JSON.parse(data);
    parsedData.retryCount = parsedData.retryCount + 1;
    parsedData.updatedAt = new Date().toISOString();

    await redisClient.set(key, JSON.stringify(parsedData));
  } catch (error) {
    console.log(error);
  }
};

export {
  saveTransactionState,
  getTransactionState,
  updateRetryCount,
  updateStatus,
};
